import { cartModel } from "../dao/models/cart.model.js";
import { ticketModel } from "../dao/models/ticket.model.js";
import { productModel } from "../dao/models/product.model.js";
import userModel from "../dao/models/user.model.js";
import { generateUniqueCode } from "../utils.js";
import Stripe from "stripe";
import config from "../config/config.js";
import { createPaymentIntent } from "../utils/payments.js";

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
        res.send({ products: cartFind.products })
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

export const getUserCart = async (req, res) => {
    try {
        console.log(req.session);

        let emailUser = req.session.user.email;
        let userFind = await userModel.findOne({ email: emailUser });

        if (!userFind) {
            return res.status(403).send("No se encontró el usuario");
        }

        res.send(userFind.cart);
    } catch (error) {
        console.log(error);
    }
}


export const addProductToUserCart = async (req, res) => {
    try {
        let { pid } = req.params
        let emailUser = req.session.user.email
        let productFind = await productModel.findOne({ _id: pid });
        let userFind = await userModel.findOne({ email:emailUser })

        if (!userFind) {
            res.status(403).send("No se encontró el usuario");
        }
        if (!productFind) {
            res.status(404).send("No se encontró el producto");
        }

        let userId = userFind._id
        let userCart = await cartModel.findOne({ user: userId })

        const existingProduct = userCart.products.find(item => item.collection.equals(productFind._id));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            userCart.products.push({
                collection: productFind._id,
                name: productFind.title,
                quantity: 1,
                price: productFind.price
            });
        }
        await userCart.save();
        res.send("Producto agregado al carrito del usuario")
    } catch (error) {
        console.log(error)
    }
}


export const purchase = async (req, res) => {
    try {
        const userEmail = req.session.user.email
        const user = await userModel.findOne({ email: userEmail })
        if(!user){
            return res.status(403).send("Usuario no encontrado");
        }

        // code
        let code = generateUniqueCode()
        const existingTicket = await ticketModel.findOne({ code: code });
        if (existingTicket) {
            let newCode;
            do {
                newCode = generateUniqueCode();
            } while (await ticketModel.findOne({ code: newCode }));
            code = newCode;
        }

        //amount
        const userId = user._id
        const userCart = await cartModel.findOne({ user: userId })
        let totalAmount = 0;
        userCart.products.forEach((product) => {
            const productTotal = product.price * product.quantity;
            totalAmount += productTotal;
        });

        const purchaseOrder = new ticketModel({
            code: code,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user._id
        })
        await purchaseOrder.save();
        
        user.purchases.push(purchaseOrder._id)
        userCart.products = []

        await user.save()
        await userCart.save()

        try {
            const paymentIntentInfo = {
                amount: totalAmount,
                currency: 'usd'
            };
            const result = await createPaymentIntent(req, res, paymentIntentInfo);
            res.redirect('/payment');
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error durante el pago" })
        }
        
    } catch (error) {
        console.log(error)
    }
}

const stripe = new Stripe(config.stripe_key); // Reemplaza 'tu_clave_secreta_de_stripe' por tu clave secreta de Stripe

export const finishPayment = async (req, res) => {
    try {
        // Datos de la tarjeta desde req.body
        const cardNumber = req.body.cardNumber;
        const expirationDate = req.body.expirationDate;
        const cvc = req.body.cvc;

        // Crea un nuevo método de pago (tarjeta) en Stripe
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expirationDate.split('/')[0], // Divide la fecha en mes y año
                exp_year: expirationDate.split('/')[1],
                cvc: cvc,
            },
        });

        // Ahora que tienes el método de pago, puedes usarlo para realizar el pago
        const charge = await stripe.charges.create({
            amount: 1000, // El monto en centavos (ejemplo: $10.00)
            currency: 'usd', // La moneda
            payment_method: paymentMethod.id, // Utiliza el ID del método de pago creado
            description: 'Compra de productos', // Descripción de la compra
        });

        // Si la carga se completó con éxito, puedes enviar una respuesta al cliente
        res.json({ message: 'Pago exitoso', charge });

    } catch (error) {
        // Si ocurre un error durante el proceso de pago, envía una respuesta de error al cliente
        console.log(error)
        res.status(500).json({ error: 'Error durante el pago' });
    }
}
