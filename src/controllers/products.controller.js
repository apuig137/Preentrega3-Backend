import { productModel } from "../dao/models/product.model.js";
import { faker } from "@faker-js/faker/locale/es_MX";
import CustomError from "../errors/CustomError.js";
import { generateProductErrorInfo } from "../errors/info.js";
import EErrors from "../errors/enums.js";
import { generateUniqueCode } from "../utils.js";

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
        res.json({ products: products });
    } else if (sort) {
        if (sort === "cheap") {
            products = await productModel.aggregate([
                { $sort: { price: 1 } }
            ]);
            res.json({ products: products })
        } else if (sort === "expensive") {
            products = await productModel.aggregate([
                { $sort: { price: -1 } }
            ]);
            res.json({ products: products });
        } else {
            return res.status(400).send("Ordenamiento no válido");
        }
    } else if (limit) {
        let limitInt = parseInt(limit);
        products = await productModel.aggregate([
            { $limit: limitInt }
        ]);
        res.json({ products: products })
    } else {
        products = await productModel.aggregate([
            { $limit: 10 }
        ]);
        res.json({ products: products })
    }
}

export const getProductId =  async (req, res) => {
    let productId = req.params.id
    let findProduct = await productModel.findOne({_id:productId})
    if (!findProduct) { 
        res.status(404).send('Producto no encontrado');
    } else {
        res.json(findProduct)
    }
}

export const addProduct = async (req, res) => {
    const { title, description, price, thumbnail } = req.body;

    try {
        const code = generateUniqueCode()
        const existingProduct = await productModel.findOne({ code: code });

        if (existingProduct) {
            let newCode;
            do {
                newCode = generateUniqueCode();
            } while (await productModel.findOne({ code: newCode }));

            code = newCode;
        }

        if (!title || !description || !price || !code) {
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
                stock: 20,
                quantity: 0,
                thumbnail,
                owner: req.session.user.email
            });
            res.send({ status: "success", payload: product });
        }
    } catch (error) {
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
    const userRole = req.session.user.role;
    const userEmail = req.session.user.email;
    const id = req.params.id;

    try {
        if (userRole === "admin") {
            const result = await productModel.deleteOne({ _id: id });
            if (result.deletedCount === 1) {
                return res.status(200).send("Producto eliminado exitosamente.");
            } else {
                return res.status(404).send("Producto no encontrado.");
            }
        }

        if (userRole === "premium") {
            const product = await productModel.findOne({ _id: id });
            if (product && product.owner === userEmail) {
                const result = await productModel.deleteOne({ _id: id });
                if (result.deletedCount === 1) {
                    return res.status(200).send("Producto eliminado exitosamente.");
                } else {
                    return res.status(404).send("Producto no encontrado.");
                }
            } else {
                return res.status(403).send("No tienes permiso para eliminar este producto.");
            }
        }

        return res.status(403).send("No tienes permiso para eliminar productos.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar el producto.");
    }
};

export const deleteAllProducts = async (req, res) => {
    try {
        await productModel.deleteMany({}); // Elimina todos los documentos en la colección de productos
        res.status(200).json({ message: 'Todos los productos han sido eliminados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar productos' });
    }
}

export const mockingProducts = async (req, res) => {
    try {
        for (let i = 0; i < 10; i++) {
            let code;
            do {
                code = generateUniqueCode();
            } while (await productModel.findOne({ code: code }));

            await productModel.create({
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                code: code,
                stock: 20,
                quantity: 0,
            });
        }
        res.status(200).send("Productos creados correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear productos de ejemplo");
    }
}
