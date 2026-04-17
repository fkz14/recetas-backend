import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// "base de datos" temporal en memoria
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

  // 2. Verificar si ya existe
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({
      message: "El usuario ya existe",
    });
  }

  // 3. Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Crear usuario
  const newUser = {
    id: users.length + 1,
    name,
    lastName,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  // 5. Respuesta
  res.status(201).json({
    message: "Usuario registrado correctamente",
  });
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Buscar usuario
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({
      message: "Credenciales inválidas",
    });
  }

  // 2. Comparar contraseña
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Credenciales inválidas",
    });
  }

  // 3. Generar token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    },
  );

  // 4. Respuesta
  res.json({
    message: "Login exitoso",
    token,
  });
};
