import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import chat from "../controllers/chat.controller.js"; // Ensure correct file extension

const router = express.Router();

router.route("/").post(chat);

export default router;
