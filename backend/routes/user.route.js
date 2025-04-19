import express from 'express';
import { signin, logout, register, updateProfile , forgetPassword, resetPassword} from "../controllers/user.contoller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/signin").post(signin);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/forget-password").post(forgetPassword);
router.post("/reset-password", resetPassword);

export default router;