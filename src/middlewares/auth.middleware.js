import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación que valida JWT
 * Verifica que el token sea válido y está presente en el header Authorization
 * Agrega el usuario decodificado a req.user para su uso en controladores
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.headers - Headers de la solicitud
 * @param {string} req.headers.authorization - Header con formato "Bearer <token>"
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {void} Llama a next() si es válido, o envía error 401
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar que el header Authorization esté presente
  if (!authHeader) {
    return res.status(401).json({
      error: "Autenticación requerida",
      message: "Token no proporcionado",
    });
  }

  // Verificar el formato del header (debe ser "Bearer <token>")
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Token inválido",
      message: "Formato de token inválido. Use: Authorization: Bearer <token>",
    });
  }

  const token = parts[1];

  try {
    // Verificar que la clave secreta JWT esté definida
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido en variables de entorno");
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar el usuario decodificado en req para uso posterior
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error de autenticación:", error.message);

    return res.status(401).json({
      error: "Token inválido",
      message: "Token inválido o expirado",
    });
  }
};