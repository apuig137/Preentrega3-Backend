import { Router } from 'express';
import { deleteInactiveUsers, deleteUser, getUsers, updateFile, updateUserRole } from '../controllers/users.controller.js';
import { uploader } from '../utils.js';

const router = Router();

router.post('/:uid/document', uploader('documents').single('document'), updateFile);

router.post('/:uid/profile', uploader('profiles').single('document'), updateFile);

router.post('/:uid/product', uploader('products').single('document'), updateFile);

router.post("/updateRole/:uid", updateUserRole)

router.get("/", getUsers)

router.delete("/", deleteInactiveUsers)

router.delete("/:uid", deleteUser)

export default router;
