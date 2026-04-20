import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Almacenamiento temporal de usuarios (en memoria)
 * En producción, reemplazar con base de datos
 */
const users = [];

/**
 * Registra un nuevo usuario con contraseña hasheada
 * @async
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.name - Nombre del usuario
 * @param {string} req.body.lastName - Apellido del usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña sin hash
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} JSON con estado del registro
 */
export const register = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "Todos los campos son obligatorios",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Verificar si el usuario ya existe
  const existingUser = users.find((u) => u.email === normalizedEmail);

  if (existingUser) {
    return res.status(400).json({
      error: "Usuario duplicado",
      message: "El usuario ya existe",
    });
  }

  try {
    // Hash de la contraseña con salto de 10 rondas
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear objeto del usuario
    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      error: "Error interno",
      message: "Error al registrar usuario",
    });
  }
};

/**
 * Autentica un usuario y retorna un JWT
 * @async
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} JSON con token JWT si es exitoso
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validar que email y contraseña estén presentes
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "Email y contraseña son obligatorios",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Buscar usuario en la base de datos temporal
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({
        error: "Autenticación fallida",
        message: "Credenciales inválidas",
      });
    }

    // Comparar contraseña ingresada con la hasheada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Autenticación fallida",
        message: "Credenciales inválidas",
      });
    }

    // Verificar que la clave secreta JWT está definida
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido en variables de entorno");
    }

    // Generar token JWT válido por 12 horas
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);

    return res.status(500).json({
      error: "Error interno",
      message: "Error al procesar el login",
    });
  }
};