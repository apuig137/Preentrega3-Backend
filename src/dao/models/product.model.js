import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
import userModel from "./user.model.js";

const productCollection = "products"

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    code:{
        type: Number,
        require: true,
        unique: true
    },
    stock:{
        type: Number,
        require: true
    },
    quantity:{
        type: Number,
        require: true
    },
    thumbnail: String,
    owner: {
        type: String, // Puedes usar String para almacenar el correo electrónico del propietario
        default: "admin", // Valor predeterminado si no se proporciona un owner
        validate: {
            validator: async function (value) {
                if (this.isNew) { // Verifica si es un nuevo producto (no una actualización)
                    const user = await userModel.findOne({ email: value }); // Suponiendo que userModel sea tu modelo de usuario
                    return user && user.premium; // Asegura que el usuario exista y sea premium
                }
                return true; // No aplica validación en actualizaciones
            },
            message: "El propietario debe ser un usuario premium."
        }
    }
})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)
