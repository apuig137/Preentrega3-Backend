import { productModel } from "../dao/models/product.model.js";
import { faker } from "@faker-js/faker/locale/es_MX";
import CustomError from "../errors/CustomError.js";
import { generateProductErrorInfo } from "../errors/info.js";
import EErrors from "../errors/enums.js";

export const getProducts = async (req, res) => {
    let { page, limit, sort } = req.query;
    req.logger.warning("Alerta!")
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
    const { title, description, price, code, stock, quantity, thumbnail } = req.body;
    try {
        if (!title || !description || !price || !code || !stock) {
            console.log("error");
            CustomError.createError({
                name: "Product creation error",
                cause: generateProductErrorInfo({ title, description, price, code, stock, quantity, thumbnail }),
                message: "Error trying to create a product",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        } else {
            let product = await productModel.create({
                title,
                description,
                price,
                code,
                stock,
                quantity,
                thumbnail,
            });
            res.send({ status: "success", payload: product });
        }
    } catch (error) {
        // Maneja la excepción aquí, por ejemplo, enviando una respuesta de error al cliente.
        console.error(error);
        res.status(500).send("Error trying to create a product");
    }
};

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

export const mockingProducts = async (req, res) => {
    try {
        for (let i = 0; i < 100; i++) {
            await productModel.create({
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                code: i,
                stock: 20,
                quantity: 0,
                // Aquí, si no tienes una imagen de ejemplo, puedes eliminar thumbnail
            });
        }
        res.status(200).send("Productos creados correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear productos de ejemplo");
    }
}