import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api
 * Endpoint de health check
 * Verifica que el servidor esté funcionando correctamente
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
    timestamp: new Date(),
  });
});

/**
 * GET /api/private
 * Endpoint protegido - requiere autenticación
 * Headers: Authorization: Bearer <token>
 */
router.get("/private", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Acceso autorizado",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;