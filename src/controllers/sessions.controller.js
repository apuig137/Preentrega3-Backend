import UserDTO from "../dao/DTOs/user.dto.js";
import config from "../config/config.js";
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    res.send({ status: "success", message: "User registered" });
}

export const failRegister = async (req, res) => {
    console.log("Error en el registro")
    res.status(400).send({ status: "error", error: "Registry fail" });
}

export const successRegister = async (req, res) => {
    console.log("Usuarrio creado exitosamente")
    res.status(200).send({ status: "success", message: "User created" });
}

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Incorrect credentials" });
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
        }
        res.send({ status: "success", payload: req.session.user, message: "¡Logueo realizado! :)" });
    } catch (error) {
        console.log(error)
    }
}

export const failLogin = async (req, res) => {
    res.status(400).send({ status: "error", error: "Login fail" });
}

export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "Couldn't logout" });
        res.redirect('/login');
    })
}

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
}

export const current = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        const { first_name, last_name, email, age } = user;
        console.log(req.user)
        const safeUserData = new UserDTO({
            first_name,
            last_name,
            email,
            age,
        });

        res.send({ status: "success", payload: safeUserData, message: "¡Logueo realizado! :)" });
    } else {
        res.status(401).send({ status: "error", message: "Usuario no autenticado" });
    }
};

const PRIVATE_KEY = `${config.private_key}`

const mailConfig = {
    service: config.mailing.service,
    port: config.mailing.port,
    auth: {
        user: config.mailing.auth.user,
        pass: config.mailing.auth.pass,
    },
}

const transport = nodemailer.createTransport(mailConfig)

const generateToken = (email) => jwt.sign({ email }, PRIVATE_KEY, { expiresIn: "1d" })

export const sendEmail = (req, res) => {
    try {
        const { email } = req.params
        const jwt = generateToken(email)

        transport.sendMail({
            from: `${config.mailing.auth.user}`,
            to: email,
            subject: "Recuperar contraseña",
            html: `<h1>Para recuperar tu contraseña hace click en en el boton de abajo</h1>
                <hr>
                <a href="http://${config.baseUrl}/api/sessions/restorepass/${jwt}">CLICK AQUI</a>
                `
        })
        res.send({ message: "Mail sent!" })
    } catch (e) {
        res.json({ error: e })
    }
}