import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getApplicants, getAppliedRequests, updateStatus, applyRequest } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyRequest);
router.route("/get").get(isAuthenticated,  getApplicants );
router.route("/:id/applicants").get(isAuthenticated, getAppliedRequests);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
 

export default router;

