import { ticketModel } from "../dao/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export const createTicket = async (req, res) => {
    const uniqueCode = uuidv4()
    const user = req.user

    const newTicket = await ticketModel.create({
        code: uniqueCode,
        purchase_datetime: Date.now(),
        amount,
        purchaser: req.user.email
    })
}