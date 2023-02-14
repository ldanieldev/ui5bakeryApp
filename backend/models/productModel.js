import mongoose from 'mongoose';
import utils from '../utils.js';

const { Schema } = mongoose;
const { getDecimal, setDecimal } = utils;

const RecipeSchema = new Schema({
  order: {
    type: Number,
    required: [true, 'Please enter an step order number']
  },
  description: {
    type: String,
    required: [true, 'Please enter an operation step description']
  },
  ingredients: [
    {
      name: {
        type: String,
        required: [true, 'Please add an ingredient name value']
      },
      uom: {
        type: String,
        required: [true, 'Please add an ingredient unit of measurement value']
      },
      uomAbbreviation: {
        type: String,
        required: [
          true,
          'Please add an ingredient unit of measurement abbreviation value'
        ]
      },
      amount: {
        required: [true, 'Please enter an ingredient amount'],
        default: 0,
        min: 0,
        type: Number,
        get: getDecimal,
        set: setDecimal
      }
    }
  ],
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
});

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

export default mongoose.model('Product', ProductSchema);
