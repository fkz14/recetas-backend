import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  getRecipeById,
} from "../controllers/recipe.controller.js";

const router = Router();

/**
 * RUTAS PROTEGIDAS (requieren autenticación)
 */

/**
 * POST /api/recipes
 * Crea una nueva receta para el usuario autenticado
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, ingredients }
 */
router.post("/", authMiddleware, createRecipe);

/**
 * GET /api/recipes/my
 * Obtiene todas las recetas del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get("/my", authMiddleware, getMyRecipes);

/**
 * PUT /api/recipes/:id
 * Actualiza una receta existente (solo el propietario)
 * Headers: Authorization: Bearer <token>
 * Body: { title?, description?, ingredients? } (todos opcionales)
 */
router.put("/:id", authMiddleware, updateRecipe);

/**
 * RUTAS PÚBLICAS (sin autenticación)
 */

/**
 * GET /api/recipes/:id
 * Obtiene una receta pública por su ID
 */
router.get("/:id", getRecipeById);

export default router;