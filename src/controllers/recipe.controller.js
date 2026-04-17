let recipes = [];

/**
 * CREAR RECETA
 */
export const createRecipe = (req, res) => {
  const { title, description, ingredients } = req.body;

  if (!title || !description || !ingredients) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  const newRecipe = {
    id: recipes.length + 1,
    title,
    description,
    ingredients,
    userId: req.user.id, 
  };

  recipes.push(newRecipe);

  res.status(201).json({
    message: "Receta creada",
    recipe: newRecipe,
  });
};

/**
 * OBTENER MIS RECETAS
 */
export const getMyRecipes = (req, res) => {
  const userRecipes = recipes.filter(
    (recipe) => recipe.userId === req.user.id
  );

  res.json(userRecipes);
};

/**
 * EDITAR RECETA
 */
export const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients } = req.body;

  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return res.status(404).json({
      message: "Receta no encontrada",
    });
  }

  // Seguridad: solo el dueño puede editar
  if (recipe.userId !== req.user.id) {
    return res.status(403).json({
      message: "No autorizado",
    });
  }

  recipe.title = title || recipe.title;
  recipe.description = description || recipe.description;
  recipe.ingredients = ingredients || recipe.ingredients;

  res.json({
    message: "Receta actualizada",
    recipe,
  });
};

/**
 * VER RECETA PUBLICA
 */
export const getRecipeById = (req, res) => {
  const { id } = req.params;

  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return res.status(404).json({
      message: "Receta no encontrada",
    });
  }

  res.json(recipe);
};