import mongoose from 'mongoose';
const { Schema } = mongoose;

const getDecimal = (value) =>
  typeof value !== 'undefined' ? parseFloat(value.toString()) : value;

const setDecimal = (value) => {
  if (typeof value !== 'undefined') {
    let convertedValue = parseFloat(value.toString());

    return isNaN(convertedValue) ? value : convertedValue;
  } else {
    return value;
  }
};

const ingredientSchema = new Schema(
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

ingredientSchema.index({ name: 1, type: -1 });
ingredientSchema.index({ stockCount: 1, type: -1 });

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export const IngredientSchema = ingredientSchema;
