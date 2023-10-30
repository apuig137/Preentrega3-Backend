import { cartModel } from "../dao/models/cart.model.js";
import { ticketModel } from "../dao/models/ticket.model.js";
import { productModel } from "../dao/models/product.model.js";

export const getCarts = async (req, res) => {
    try {
        let carts = await cartModel.find()
        res.send({carts})
    } catch (error) {
        console.log(error)
    }
}

export const getCartById = async (req, res) => {
    let cartId = req.params.cid
    let cartFind = await cartModel.findOne({_id:cartId}).populate("products").lean()
    if(!cartFind){
        res.status(404).send('Carrito no encontrado')
    } else {
        res.render("cart", { products: cartFind.products })
    }
}

export const createCart = async (req, res) => {
    try {
        let newCart = await cartModel.create({})
        res.send(newCart)
    } catch (error) {
        console.log(error)
    }
}

export const addProductToCart = async (req, res) => {
    let { pid, cid } = req.params;
    let productFind = await productModel.findOne({ _id: pid });
    let cartFind = await cartModel.findOne({ _id: cid });

    if (!productFind) {
        res.status(404).send('Producto no encontrado');
    }
    if (!cartFind) {
        res.status(403).send('Carrito no encontrado');
    }
    
    cartFind.products.push({
        collection: productFind._id,
        name: productFind.title,
    });

    cartFind.save();
    res.status(200).send('Producto agregado');
}

export const deleteCart = async (req, res) => {
    let { cid } = req.params
    let cart = await cartModel.findOne({ _id:cid })
    if (!cart) {
        return res.status(404).send("No se encontró el carrito");
    }
    cart.products = []
    await cart.save()
    res.send("Se eliminaron todos los productos del carrito")
}

export const deleteProductToCart = async (req, res) => {
    let { cid, pid } = req.params
    let cart = await cartModel.findOne({ _id:cid })
    let product = await productModel.findOne({ _id:pid })
    if (!cart || !product) {
        return res.status(404).send("No se encontró el carrito o el producto");
    }
    cart.products = cart.products.filter((cartProduct) => cartProduct._id.toString() !== pid)
    await cart.save();
    res.send("Producto eliminado del carrito")
}

export const addProductToUserCart = async (req, res) => {
    try {
        console.log(req.session)
        res.send("Producto agregado al carrito del usuario")
    } catch (error) {
        console.log(error)
    }
}

export const purchase = async (req, res) => {
    const cartId = req.params.cid;
    
    try {
        // Obtén el carrito por su ID
        const cart = await cartModel
            .findById(cartId)
            .populate("products.collection");
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        // Recorre los elementos del carrito
        for (const cartItem of cart.products) {
            if (cartItem.collection) {
                const product = cartItem.collection;
                
                // Verifica el stock del producto
                if (product.stock >= cartItem.quantity) {
                    // Resta la cantidad del producto del stock
                    product.stock -= cartItem.quantity;
                    await product.save();
                }
            }
        }
        
        // Limpieza del carrito
        cart.products = [];
        await cart.save();
        const ticket = await ticketModel.create({
            code: uniqueCode,
            purchase_datetime: Date.now(),
            amount,
            purchaser: req.user.email
        }) 
        res.status(200).json({ message: "New ticket generated" });
    } catch (error) {
        console.error("Error finalizing purchase:", error);
        res.status(500).json({ message: "Error finalizing purchase" });
    }
}