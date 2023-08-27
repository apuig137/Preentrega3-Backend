import { productModel } from "../dao/models/product.model.js";

export const getProducts = async (req, res) => {
    let { page, limit, sort } = req.query;
    let products;
    if (page) {
        products = await productModel.paginate(
            {},
            {
                limit: 5,
                lean: true,
                page: page ?? 1
            }
        );
        res.render("products", { products: products.docs, productsPages: products });
    } else if (sort) {
        if (sort === "cheap") {
            products = await productModel.aggregate([
                { $sort: { price: 1 } }
            ]);
            res.render("products", { products: products });
        } else if (sort === "expensive") {
            products = await productModel.aggregate([
                { $sort: { price: -1 } }
            ]);
            res.render("products", { products: products });
        } else {
            return res.status(400).send("Ordenamiento no válido");
        }
    } else if (limit) {
        let limitInt = parseInt(limit);
        products = await productModel.aggregate([
            { $limit: limitInt }
        ]);
        res.render("products", { products: products });
    } else {
        products = await productModel.aggregate([
            { $limit: 10 }
        ]);
        res.render("products", { products: products });
    }
}

export const getProductId =  async (req, res) => {
    let productId = req.params.id
    let findProduct = await productModel.findOne({_id:productId})
    let productsList = await productModel.find()
    if (!productId) { 
        res.send(productsList) 
    } else {
        res.send(findProduct)
    }
}

export const addProduct = async (req, res) => {
    try {
        const {title, description, price, code, stock, quantity, thumbnail} = req.body
        let product = await productModel.create({
            title,
            description,
            price,
            code,
            stock,
            quantity,
            thumbnail
        })
        res.send({status:"succes",payload:product})
    } catch (error) {
        console.error(error)
    }
}

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const dataToUpdate = req.body;
    if(!dataToUpdate){
        res.status(404).send('Producto no encontrado');
        return
    }
    let result = await productModel.updateOne({_id:id}, dataToUpdate)
    res.send({status:"succes",payload:result});
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const result = await productModel.deleteOne({_id:id})
    res.status(200).send("Producto eliminado exitosamente.")
}