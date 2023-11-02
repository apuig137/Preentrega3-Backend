import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    products: [
        {
            collection: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            name: String,
            quantity: Number,
            price: Number
        }
    ]
});

export const cartModel = mongoose.model(cartCollection, cartSchema)

