import expressAsyncHandler from 'express-async-handler';
import Ingredient from '../models/ingredientModel.js';

/**
 * Get Ingredients
 * @route       GET /api/ingredients
 * @param req   request
 * @param res   response
 * @returns     JSON list of ingredients
 * @private
 */
const getIngredients = expressAsyncHandler(async (req, res) => {
  const ingredients = await Ingredient.find();
  res.status(200).json(ingredients);
});

/**
 * Set Ingredients
 * @route       POST /api/ingredients
 * @param req   request
 * @param res   response
 * @returns     JSON list of ingredients
 * @private
 */
const setIngredient = expressAsyncHandler(async (req, res) => {
  const { name, uom, uomAbbreviation, price } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Please add a name parameter');
  }
  if (!uom) {
    res.status(400);
    throw new Error('Please add a uom parameter');
  }
  if (!uomAbbreviation) {
    res.status(400);
    throw new Error('Please add a uomAbbreviation parameter');
  }
  if (!price) {
    res.status(400);
    throw new Error('Please add a price parameter');
  }

  const ingredient = await Ingredient.create(req.body);
  res.status(200).json(ingredient);
});

/**
 * Update Ingredients
 * @route       PUT /api/ingredients/:id
 * @param req   request
 * @param res   response
 * @returns     JSON data of updated ingredient
 * @private
 */
const updateIngredient = expressAsyncHandler(async (req, res) => {
  const { name, uom, uomAbbreviation, price } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add a name parameter');
  }
  if (!uom) {
    res.status(400);
    throw new Error('Please add a uom parameter');
  }
  if (!uomAbbreviation) {
    res.status(400);
    throw new Error('Please add a uomAbbreviation parameter');
  }
  if (!price) {
    res.status(400);
    throw new Error('Please add a price parameter');
  }

  const updatedIngredient = await Ingredient.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json(updatedIngredient);
});

/**
 * Delete Ingredient
 * @route       DELETE /api/ingredients/:id
 * @param req   request
 * @param res   response
 * @returns     JSON deleted ingredient id
 * @private
 */
const deleteIngredient = expressAsyncHandler(async (req, res) => {
  await Ingredient.findOneAndRemove({ _id: req.params.id });
  res.status(200).json({ id: req.params.id });
});

export { getIngredients, setIngredient, updateIngredient, deleteIngredient };
