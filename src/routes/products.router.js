import { Router } from "express";
import { privateAccess } from "./views.router.js";
import { getProducts, getProductId, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { checkUserRole } from "../utils.js";

const router = Router()

router.get("/", getProducts)

router.get("/:id", privateAccess, getProductId)

router.post("/", privateAccess, addProduct)

router.put('/:id', privateAccess, updateProduct);

router.delete('/:id', checkUserRole("admin"), deleteProduct);

export default router;
