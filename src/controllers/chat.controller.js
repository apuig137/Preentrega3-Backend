import { messageModel } from "../dao/models/message.model.js"

export const getChat = async (req, res) => {
    let messagesFind = await messageModel.find().lean()
    console.log(messagesFind)
    res.render("chat", { messages: messagesFind })
}

export const sendMessage = async (req, res) => {
    const { user, text } = req.body;
    let messageSend = await messageModel.create({
        user,
        text
    });
    let messagesFind = await messageModel.find().lean();
    res.render("chat", { messages: messagesFind });
}

export const deleteMessage = async (req, res) => {
    let id = req.params.id
    let result = await messageModel.deleteOne({_id:id})
    let messagesFind = await messageModel.find().lean();
    res.render("chat", { messages: messagesFind });
}