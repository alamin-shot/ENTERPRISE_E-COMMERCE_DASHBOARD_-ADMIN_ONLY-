"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// GET /api/users/stats — before /:id
router.get("/stats", auth_middleware_1.requireManager, user_controller_1.getUserStats);
router.get("/", auth_middleware_1.requireManager, user_controller_1.getUsers);
router.get("/:id", auth_middleware_1.requireManager, user_controller_1.getUserById);
// Write operations — admin only
router.post("/", auth_middleware_1.requireAdmin, user_controller_1.createUser);
router.patch("/:id", auth_middleware_1.requireAdmin, user_controller_1.updateUser);
router.delete("/:id", auth_middleware_1.requireAdmin, user_controller_1.deleteUser);
exports.default = router;
