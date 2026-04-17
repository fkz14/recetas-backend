import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // 1. Obtener token del header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No hay token, acceso denegado",
    });
  }

  // formato: "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  try {
    // 2. Verificar token
    const decoded = jwt.verify(token, "secretkey");

    // 3. Guardar info del usuario en la request
    req.user = decoded;

    // 4. Continuar
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
};