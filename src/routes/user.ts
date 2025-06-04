import express from "express";
import userController from "../controllers/user";

const router = express.Router();

router.get("/", userController.readUsers);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
