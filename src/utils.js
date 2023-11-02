import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import { default as jwt } from 'jsonwebtoken'
import config from "./config/config.js"
import multer from "multer"
import path from "path"

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (password, hash) => bcrypt.compareSync(password, hash)

export const checkUserRole = (role) => {
    return (req, res, next) => {
        console.log(req.session.user)
        if (req.isAuthenticated() && req.session.user.role === role) {
            return next();
        } else {
            res.status(403).send({ status: "error", message: "Unauthorized access" });
        }
    };
};

export const premiumPass = async (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin" || req.session.user && req.session.user.role === "premium") {
        return next();
    }
    res.status(403).send({ status: "error", message: "Unauthorized access" });
};

export const adminPass = async (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    res.status(403).send({ status: "error", message: "Unauthorized access" });
};

const PRIVATE_KEY = `${config.private_key}`

export const validateToken = (req, res, next) => {
    try {
        const { token } = req.params
        jwt.verify(token, PRIVATE_KEY)
        const data = jwt.decode(token)
        req.email = data.email
        next()
    } catch (e) {
        res.send(`Hubo un error al intentar recuperar la contraseña: ${e.message}`)
    }
    
}

export const generateUniqueCode = () => {
    let code = 0;

    for (let i = 0; i < 6; i++) {
        const digit = Math.floor(Math.random() * 10);
        code = code * 10 + digit; // Agrega el dígito al código, desplazando los dígitos existentes una posición a la izquierda
    }

    return code;
}

export const uploader = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `${__dirname}/public/js/uploads/${folderName}`);
            },
            filename: function (req, file, cb) {
                console.log("Archivo subido correctamente: ", file);
                cb(null, file.originalname);
            },
        }),
        onError: function (err, next) {
            console.log("Error al subir el archivo: ", err);
            next();
        },
    })
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname