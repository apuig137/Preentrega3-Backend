import mongoose from "mongoose";

const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)
