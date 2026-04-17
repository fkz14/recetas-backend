import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  getRecipeById,
} from "../controllers/recipe.controller.js";

const router = Router();

// privadas
router.post("/", authMiddleware, createRecipe);
router.get("/my", authMiddleware, getMyRecipes);
router.put("/:id", authMiddleware, updateRecipe);

// pública
router.get("/:id", getRecipeById);

export default router;