import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

/**
 * Manejo de señales de cierre para limpieza ordenada
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\nSIGINT recibido, cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});