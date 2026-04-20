let recipes = [];
let currentId = 1;

/**
 * CREAR RECETA
 */
export const createRecipe = (req, res) => {
  const { title, description, ingredients } = req.body;

  if (!title?.trim() || !description?.trim() || !ingredients?.trim()) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const newRecipe = {
      id: currentId++,
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients.trim(),
      userId: req.user.id,
      createdAt: new Date(),
    };

    recipes.push(newRecipe);

    return res.status(201).json({
      message: "Receta creada",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Create recipe error:", error);

    return res.status(500).json({
      message: "Error al crear receta",
    });
  }
};

/**
 * OBTENER MIS RECETAS
 */
export const getMyRecipes = (req, res) => {
  try {
    const userRecipes = recipes.filter(
      (recipe) => recipe.userId === req.user.id
    );

    return res.json({
      recipes: userRecipes,
    });
  } catch (error) {
    console.error("Get recipes error:", error);

    return res.status(500).json({
      message: "Error al obtener recetas",
    });
  }
};

/**
 * EDITAR RECETA
 */
export const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const recipe = recipes.find((r) => r.id === Number(id));

    if (!recipe) {
      return res.status(404).json({
        message: "Receta no encontrada",
      });
    }

    // Seguridad
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    recipe.title = title?.trim() || recipe.title;
    recipe.description = description?.trim() || recipe.description;
    recipe.ingredients = ingredients?.trim() || recipe.ingredients;
    recipe.updatedAt = new Date();

    return res.json({
      message: "Receta actualizada",
      recipe,
    });
  } catch (error) {
    console.error("Update recipe error:", error);

    return res.status(500).json({
      message: "Error al actualizar receta",
    });
  }
};

/**
 * VER RECETA PUBLICA
 */
export const getRecipeById = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const recipe = recipes.find((r) => r.id === Number(id));

    if (!recipe) {
      return res.status(404).json({
        message: "Receta no encontrada",
      });
    }

    return res.json({
      recipe,
    });
  } catch (error) {
    console.error("Get recipe error:", error);

    return res.status(500).json({
      message: "Error al obtener receta",
    });
  }
};