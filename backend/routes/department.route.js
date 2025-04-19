import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getDepartment, getDepartmentById, registerDepartment, updateDepartment , deleteDepartment } from "../controllers/department.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerDepartment);
router.route("/get").get(isAuthenticated,getDepartment);
router.route("/get/:id").get(isAuthenticated,getDepartmentById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateDepartment);
router.delete("/delete/:id",isAuthenticated,singleUpload, deleteDepartment);
export default router;
