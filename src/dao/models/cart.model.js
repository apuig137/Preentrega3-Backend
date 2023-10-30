import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: "Sin usuario"
    },
    products: [
        {
            collection: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            name: String
        }
    ]
});

export const cartModel = mongoose.model(cartCollection, cartSchema)

