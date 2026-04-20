import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verificar header
  if (!authHeader) {
    return res.status(401).json({
      message: "Token no proporcionado",
    });
  }

  // 2. Verificar formato Bearer
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Formato de token inválido",
    });
  }

  const token = parts[1];

  try {
    // 3. Verificar existencia de secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido");
    }

    // 4. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Guardar usuario
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};