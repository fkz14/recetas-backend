import express from "express";
import cors from "cors";

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * Rutas de la API
 */
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

/**
 * Manejo de rutas no encontradas (404)
 */
app.use((req, res) => {
  res.status(404).json({
    error: "No encontrado",
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

/**
 * Manejo global de errores
 * Este middleware captura errores de toda la aplicación
 */
app.use((err, req, res, next) => {
  console.error("Error del servidor:", err);

  // Verificar si la respuesta ya fue enviada
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Error interno",
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

export default app;