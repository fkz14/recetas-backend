import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  getRecipeById,
} from "../controllers/recipe.controller.js";

const router = Router();

// pública 
router.get("/:id", getRecipeById);

// middleware para rutas privadas
router.use(authMiddleware);

// privadas
router.post("/", createRecipe);
router.get("/my", getMyRecipes);
router.put("/:id", updateRecipe);

export default router;