import userModel from "../dao/models/user.model.js";

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

        if(user.role === 'user'){
            const requiredDocuments = ['identificacion', 'domicilio', 'estado de cuenta'];
            const userDocuments = user.documents;

            const hasAllDocuments = requiredDocuments.every(requiredDocument => {
                return userDocuments.some(userDocument => userDocument.name.includes(requiredDocument))
            });

            if (!hasAllDocuments) throw new Error('El usuario no tiene los documentos necesarios');
        }

        user.role = "premium"
        await user.save()
        res.send({ message: 'Rol de usuario actualizado correctamente', user });
    } catch (e) {
        throw new Error(e);
    }
}