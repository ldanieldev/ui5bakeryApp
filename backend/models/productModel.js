import mongoose from 'mongoose';
import { IngredientSchema } from './ingredientModel.js';
import utils from '../utils.js';

const { Schema } = mongoose;
const { getDecimal, setDecimal } = utils;

IngredientSchema.add({
  amount: { type: mongoose.Types.Decimal128, get: getDecimal, set: setDecimal }
});

const RecipeSchema = new Schema(
  {
    order: {
      type: Number,
      required: [true, 'Please enter an step order number']
    },
    description: {
      type: String,
      required: [true, 'Please enter an operation step description']
    },
    target: {
      required: [true, 'Please enter a target limit'],
      type: mongoose.Types.Decimal128,
      get: getDecimal,
      set: setDecimal
    },
    targetUom: {
      type: String,
      required: [true, 'Please enter a target unit of measure']
    },
    ingredients: [IngredientSchema],
    instructions: [
      {
        order: {
          type: Number,
          required: [true, 'Please enter an instruction order number']
        },
        instruction: {
          type: String,
          required: [true, 'Please enter an instruction detail']
        }
      }
    ]
  },
  { toJSON: { getters: true } }
);

const ProductSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: [true, 'Please add a name value'],
      unique: true
    },
    description: String,
    category: {
      type: String,
      required: [true, 'Please enter a product category']
    },
    image: String,
    recipe: [RecipeSchema],
    tags: [{ tag: String }]
  },
  { timestamps: true, toJSON: { getters: true } }
);

ProductSchema.index({ name: 1, type: -1 });
ProductSchema.index({ category: 1, type: -1 });
ProductSchema.index({ tags: 1, type: -1 });

export default mongoose.model('Product', ProductSchema);
