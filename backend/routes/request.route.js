import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminRequests, getAllRequest, getRequestById, postRequest, getUserRequests, updateRequestStatus } from "../controllers/request.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postRequest); // Ensure this matches the frontend
router.route("/get").get(isAuthenticated, getAllRequest);
router.route("/getadminRequest").get(isAuthenticated, getAdminRequests);
router.route("/get/:id").get(isAuthenticated, getRequestById);
router.route("/user").get(isAuthenticated, getUserRequests); // Ensure this route exists and is correctly implemented
router.route("/status/:id/update").post(isAuthenticated, updateRequestStatus);

router.get("/user", isAuthenticated, (req, res) => {
  // Example route that requires authentication
  res.json({ message: "Authenticated user data" });
});

export default router;

