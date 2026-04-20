import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando",
    timestamp: new Date(),
  });
});

// ruta protegida
router.get("/private", authMiddleware, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;