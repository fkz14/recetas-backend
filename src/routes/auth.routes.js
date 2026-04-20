import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 * Body: { name, lastName, email, password }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Autentica un usuario y retorna un JWT
 * Body: { email, password }
 */
router.post("/login", login);

export default router;