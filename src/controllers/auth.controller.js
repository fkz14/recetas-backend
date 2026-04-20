import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// "base de datos" temporal
const users = [];

/**
 * REGISTRO
 */
export const register = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  // 1. Validación
  if (!name || !lastName || !email || !password) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  const normalizedEmail = email.toLowerCase();

  // 2. Verificar si ya existe
  const existingUser = users.find((u) => u.email === normalizedEmail);

  if (existingUser) {
    return res.status(400).json({
      message: "El usuario ya existe",
    });
  }

  try {
    // 3. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear usuario
    const newUser = {
      id: users.length + 1,
      name,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Error al registrar usuario",
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validación
  if (!email || !password) {
    return res.status(400).json({
      message: "Email y contraseña son obligatorios",
    });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // 2. Buscar usuario
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas",
      });
    }

    // 3. Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Credenciales inválidas",
      });
    }

    // 4. Validar secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido");
    }

    // 5. Generar token
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

    // 6. Respuesta
    return res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Error en el login",
    });
  }
};