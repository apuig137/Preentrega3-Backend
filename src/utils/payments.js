import Stripe from "stripe";
import config from "../config/config.js";
import userModel from "../dao/models/user.model.js";

const stripe = new Stripe(config.stripe_key);

export async function createPaymentIntent(req, res, { amount, currency }) {
    try {
        let userEmail = req.session.user.email;
        let user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(403).send("Usuario no encontrado");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                user: JSON.stringify({
                    id: user._id,
                    name: user.first_name + user.last_name,
                    email: userEmail,
                    price: amount
                }, null, '\t')
            }
        });
        return paymentIntent;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el intento de pago" });
    }
}