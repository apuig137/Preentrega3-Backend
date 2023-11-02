import { Router } from 'express';
import { createTicket, getUserTickets } from '../controllers/ticket.controller.js';

const router = Router()

router.post("/", createTicket)

router.get("/:uid", getUserTickets)

export default router
