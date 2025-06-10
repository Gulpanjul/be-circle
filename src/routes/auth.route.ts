import express from "express";
import authController from "../controllers/auth.controller";
import { authCheck } from "../middlewares/auth-check.middlewares";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/check", authenticate, authController.check);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authenticate, authController.resetPassword);

export default router;
