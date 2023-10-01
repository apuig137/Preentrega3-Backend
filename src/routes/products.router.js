import { Router } from "express";
import { getProducts, getProductId, addProduct, updateProduct, deleteProduct, mockingProducts } from "../controllers/products.controller.js";
import { adminPass } from "../utils.js";

const router = Router()

router.get("/", getProducts)

router.get("/:id", getProductId)

router.post("/", adminPass, addProduct)

router.put('/:id', adminPass, updateProduct);

router.delete('/deleteproduct/:id', adminPass, deleteProduct);

router.post('/mockingproducts', mockingProducts)

export default router;
