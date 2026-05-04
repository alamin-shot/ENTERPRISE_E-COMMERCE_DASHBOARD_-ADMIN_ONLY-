import { Router } from "express";
import {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import {
  authenticate,
  requireAdmin,
  requireManager,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/users/stats — before /:id
router.get("/stats", requireManager, getUserStats);
router.get("/", requireManager, getUsers);
router.get("/:id", requireManager, getUserById);

// Write operations — admin only
router.post("/", requireAdmin, createUser);
router.patch("/:id", requireAdmin, updateUser);
router.delete("/:id", requireAdmin, deleteUser);

export default router;
