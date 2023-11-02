import userModel from "../dao/models/user.model.js";
import mongoose from "mongoose";
import config from "../config/config.js";
import nodemailer from "nodemailer"

export const updateFile = async (req, res) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo guardar el documento" });
    }

    try {
        const { uid } = req.params;
        const user = await userModel.findOne({ _id: uid });

        if(!user){
            res.status(404).send({ status: "error", message: "Usuario no encontrado" })
        }

        const uploadedFileName = req.file.originalname;
        const fileNameWithoutExtension = uploadedFileName.split(".")[0];
        const newDocument = {
            name: fileNameWithoutExtension,
            reference: req.file.path
        };

        user.documents.push(newDocument)

        await user.save();
        res.send({ message: 'User document updated!', user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findOne({ _id: uid });

        if(!user){
            res.status(404).send({ status: "error", message:"Usuario no encontrado" });
        }

        if(user.role === 'user'){
            const requiredDocuments = ['identificacion', 'domicilio', 'estado de cuenta'];
            const userDocuments = user.documents;

            const hasAllDocuments = requiredDocuments.every(requiredDocument => {
                return userDocuments.some(userDocument => userDocument.name.includes(requiredDocument))
            });

            if (!hasAllDocuments) throw new Error('El usuario no tiene los documentos necesarios');
            user.role = "premium"
        }

        if(user.role === 'premium'){
            user.role = "user"
        }

        if(user.role === 'admin'){
            user.role = "admin"
        }

        await user.save()
        res.send({ message: 'Rol de usuario actualizado correctamente', user });
    } catch (error) {
        console.log(error)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'email role first_name last_name');

        res.send({users});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

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

export const deleteInactiveUsers = async (req, res) => {
    try {
        const limit = new Date();
        limit.setDate(limit.getDate() - 2);

        const inactiveUsers = await userModel.find({
            last_connection: { $lt: limit },
            role: { $ne: "admin" }
        });

        for (const user of inactiveUsers) {
            const userEmail = user.email;
            try {
                console.log("Enviando correo electrónico");
                await transport.sendMail({
                    from: `${config.mailing.auth.user}`,
                    to: userEmail,
                    subject: "Usuario eliminado",
                    html: "<h1>Su usuario fue eliminado por inactividad</h1>"
                });
            } catch (e) {
                console.error(e);
            }
        }

        const result = await userModel.deleteMany({
            last_connection: { $lt: limit },
            role: { $ne: "admin" }
        });

        res.send({
            message: `Se eliminaron ${result.deletedCount} usuarios inactivos.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.deleteOne({ _id: uid })
        res.send({ message: `Usuario con ID ${uid} eliminado correctamente.` })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrió un error al eliminar el usuario.' });
    }
}

export const sendEmail = (req, res) => {
    try {
        const { email } = req.params
        const jwt = generateToken(email)

        transport.sendMail({
            from: `${config.mailing.auth.user}`,
            to: email,
            subject: "Usuario eliminado",
            html: "<h1>Su usuario fue eliminado por inactividad</h1>"
        })
        res.send({ message: "Mail sent!" })
    } catch (e) {
        res.json({ error: e })
    }
}