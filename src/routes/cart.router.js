import { Router } from "express";
import { getCarts, getCartById, addProductToCart, deleteCart, deleteProductToCart, createCart, purchase, addProductToUserCart, getUserCart, finishPayment } from "../controllers/cart.controller.js";

const router = Router()

router.post("/purchase", purchase)

router.post("/finishpayment", finishPayment)

router.get("/getUserCart", getUserCart)

router.get("/", getCarts)

router.post("/", createCart)

router.get("/:cid", getCartById)

router.delete("/:cid", deleteCart)

router.post("/cart/:cid/product/:pid", addProductToCart)

router.delete("/:cid/product/:pid", deleteProductToCart)

router.post("/addProductToCart/:pid", addProductToUserCart)

export default router;
