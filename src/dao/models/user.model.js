import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    purchases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tickets",
        }
    ]
})

const userModel = mongoose.model(userCollection,userSchema);

export default userModel;
