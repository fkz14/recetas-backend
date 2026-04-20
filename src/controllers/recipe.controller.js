/**
 * Almacenamiento temporal de recetas (en memoria)
 * En producción, reemplazar con base de datos
 */
let recipes = [];
let currentId = 1;

/**
 * Crea una nueva receta asociada al usuario autenticado
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.title - Título de la receta
 * @param {string} req.body.description - Descripción de la receta
 * @param {string} req.body.ingredients - Ingredientes de la receta
 * @param {Object} req.user - Usuario autenticado (desde middleware)
 * @param {number} req.user.id - ID del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} JSON con la receta creada
 */
export const createRecipe = (req, res) => {
  const { title, description, ingredients } = req.body;

  // Validar que todos los campos requeridos estén presentes y no vacíos
  if (!title?.trim() || !description?.trim() || !ingredients?.trim()) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "Todos los campos (title, description, ingredients) son obligatorios",
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
      message: "Receta creada exitosamente",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error al crear receta:", error);

    return res.status(500).json({
      error: "Error interno",
      message: "Error al crear receta",
    });
  }
};

/**
 * Obtiene todas las recetas del usuario autenticado
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.user - Usuario autenticado (desde middleware)
 * @param {number} req.user.id - ID del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Array} Array de recetas del usuario
 */
export const getMyRecipes = (req, res) => {
  const userId = Number(req.user.id);

  const userRecipes = recipes.filter(
    (recipe) => Number(recipe.userId) === userId
  );

  return res.json(userRecipes);
};

/**
 * Actualiza una receta existente (solo el propietario puede actualizar)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la receta a actualizar
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.title - Nuevo título (opcional)
 * @param {string} req.body.description - Nueva descripción (opcional)
 * @param {string} req.body.ingredients - Nuevos ingredientes (opcional)
 * @param {Object} req.user - Usuario autenticado (desde middleware)
 * @param {number} req.user.id - ID del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} JSON con la receta actualizada
 */
export const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients } = req.body;

  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "ID de receta inválido",
    });
  }

  try {
    const recipe = recipes.find((r) => r.id === Number(id));

    if (!recipe) {
      return res.status(404).json({
        error: "No encontrado",
        message: "Receta no encontrada",
      });
    }

    // Verificar que el usuario sea el propietario de la receta
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({
        error: "Acceso denegado",
        message: "No tienes permiso para actualizar esta receta",
      });
    }

    // Actualizar solo los campos que se proporcionen
    recipe.title = title?.trim() || recipe.title;
    recipe.description = description?.trim() || recipe.description;
    recipe.ingredients = ingredients?.trim() || recipe.ingredients;
    recipe.updatedAt = new Date();

    return res.status(200).json({
      message: "Receta actualizada exitosamente",
      recipe,
    });
  } catch (error) {
    console.error("Error al actualizar receta:", error);

    return res.status(500).json({
      error: "Error interno",
      message: "Error al actualizar receta",
    });
  }
};

/**
 * Obtiene una receta pública por su ID (acceso sin autenticación)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la receta a obtener
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} JSON con los datos de la receta
 */
export const getRecipeById = (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "ID de receta inválido",
    });
  }

  try {
    const recipe = recipes.find((r) => r.id === Number(id));

    if (!recipe) {
      return res.status(404).json({
        error: "No encontrado",
        message: "Receta no encontrada",
      });
    }

    return res.json(recipe);
  } catch (error) {
    console.error("Error al obtener receta:", error);

    return res.status(500).json({
      error: "Error interno",
      message: "Error al obtener receta",
    });
  }
};