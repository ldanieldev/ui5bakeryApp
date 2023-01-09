import express from 'express';
import {
  getIngredients,
  setIngredient,
  updateIngredient,
  deleteIngredient
} from '../controllers/ingredientController.js';

const router = express.Router();

router.route('/').get(getIngredients).post(setIngredient);
router.route('/:id').put(updateIngredient).delete(deleteIngredient);

export default router;
