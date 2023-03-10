import mongoose from 'mongoose';
import utils from '../utils.js';

const { Schema } = mongoose;
const { getDecimal, setDecimal } = utils;

const IngredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name value'],
      unique: true
    },
    uom: {
      type: String,
      required: [true, 'Please add a unit of measurement value']
    },
    uomAbbreviation: {
      type: String,
      required: [true, 'Please add a unit of measurement abbreviation value']
    },
    stockCount: {
      type: mongoose.Types.Decimal128,
      default: 0,
      min: 0,
      get: getDecimal,
      set: setDecimal
    },
    reorderThreshold: {
      type: mongoose.Types.Decimal128,
      get: getDecimal,
      set: setDecimal,
      min: 0
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: [true, 'Please add a price value'],
      default: 0,
      min: 0,
      get: getDecimal,
      set: setDecimal
    }
  },
  { toJSON: { getters: true } }
);

export default mongoose.model('Ingredient', IngredientSchema);
