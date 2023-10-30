import { Router } from "express";
import { getProducts, getProductId, addProduct, updateProduct, deleteProduct, mockingProducts, deleteAllProducts } from "../controllers/products.controller.js";
import { adminPass, premiumPass } from "../utils.js";

const router = Router()

router.get("/", getProducts)

router.post("/", premiumPass, addProduct)

router.get("/:id", getProductId)

router.put('/:id', premiumPass, updateProduct);

router.post('/mockingproducts', adminPass, mockingProducts)

router.delete("/deleteall", adminPass, deleteAllProducts)

router.delete('/:id', premiumPass, deleteProduct);

export default router;
