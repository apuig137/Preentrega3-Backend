import { Router } from "express";
import { deleteMessage, getChat, sendMessage } from "../controllers/chat.controller.js";
import { checkUserRole } from "../utils.js";

const router = Router()

router.get("/", getChat)

router.post("/", checkUserRole("user"), sendMessage);

router.delete("/:id", deleteMessage)

export default router
