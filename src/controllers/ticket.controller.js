import { ticketModel } from "../dao/models/ticket.model.js";
import userModel from "../dao/models/user.model.js";
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

export const getUserTickets = async (req, res) => {
    try {
        let { uid } = req.params
        let userFind = await userModel.findOne({ _id: uid });

        if (!userFind) {
            return res.status(403).send("No se encontró el usuario");
        }

        // Obtener las compras (tickets) del usuario
        const userTickets = userFind.purchases;
        // Array para almacenar la información de los tickets
        const ticketsInfo = [];
        // Recorrer los tickets del usuario y obtener información
        for (const ticketId of userTickets) {
            const ticket = await ticketModel.findOne({ _id: ticketId });
            if (ticket) {
                // Agregar información relevante de cada ticket al array
                ticketsInfo.push({
                    purchase_datetime: ticket.purchase_datetime,
                    amount: ticket.amount,
                });
            }
        }

        // Enviar la información de los tickets al cliente
        res.send({ tickets: ticketsInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las compras del usuario");
    }
}