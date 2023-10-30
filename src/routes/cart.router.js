import { Router } from "express";
import { getCarts, getCartById, addProductToCart, deleteCart, deleteProductToCart, createCart, purchase, addProductToUserCart } from "../controllers/cart.controller.js";

const router = Router()

router.get("/", getCarts)

router.post("/", createCart)

router.get("/:cid", getCartById)

router.delete("/:cid", deleteCart)

router.post("/:cid/product/:pid", addProductToCart)

router.delete("/:cid/product/:pid", deleteProductToCart)

router.post("/:cid/purchase", purchase)

router.post("/addProductToCart", addProductToUserCart)

export default router;
