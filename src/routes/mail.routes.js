import { Router } from "express";
import { sendMail } from "../controllers/mail.controller.js";

const router = Router ();

//POST
router.get("/", sendMail);

export default router;