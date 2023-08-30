import { Router } from "express";
import { getProducts, getProductId, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { checkUserRole, adminPass } from "../utils.js";

const router = Router()

router.get("/", getProducts)

router.get("/:id", getProductId)

router.post("/", checkUserRole("admin"), addProduct)

router.put('/:id', checkUserRole("admin"), updateProduct);

router.delete('/:id', adminPass, deleteProduct);

export default router;
