import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { getCarts, getCartById, addProductToCart, deleteCart, deleteProductToCart, createCart } from "../controllers/cart.controller.js";

const router = Router()

router.get("/", getCarts)

router.get("/:cid", getCartById)

router.post("/", createCart)

router.post("/:cid/product/:pid", addProductToCart)

router.delete("/:cid", deleteCart)

router.delete("/:cid/product/:pid", deleteProductToCart)

router.post("/:cid/purchase", )

export default router;