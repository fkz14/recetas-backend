import express from "express";
import cors from "cors";

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Error interno del servidor",
  });
});

export default app;