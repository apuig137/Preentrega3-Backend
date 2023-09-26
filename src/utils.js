import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import { default as jwt } from 'jsonwebtoken'
import config from "./config/config.js"

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

export const adminPass = async (req, res, next) => {
    console.log(req.session.user)
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

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname