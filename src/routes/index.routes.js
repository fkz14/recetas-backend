import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// ruta protegida
router.get("/private", authMiddleware, (req, res) => {
  res.json({
    message: "Accediste a una ruta privada 🔐",
    user: req.user,
  });
});

export default router;