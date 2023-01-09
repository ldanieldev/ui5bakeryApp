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

const OperationSchema = new Schema(
  {
    order: {
      type: Number,
      required: [true, 'Please enter an step order number']
    },
    description: {
      type: String,
      required: [true, 'Please enter an operation step description']
    },
    instructions: [
      {
        order: Number,
        instruction: String
      }
    ],
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
    ingredients: [
      {
        ingredient: {
          type: mongoose.Types.ObjectId,
          ref: 'Ingredients'
        },
        amount: {
          type: mongoose.Types.Decimal128,
          get: getDecimal,
          set: setDecimal
        }
      }
    ]
  },
  { toJSON: { getters: true } }
);

/*
TODO: https://stackoverflow.com/questions/45475639/mongoose-set-this-field-to-true-others-will-be-false
RecipeSchema.pre('save', function (next) {
  if (this.active === true) {
    this.constructor
      .update({}, { $set: { default: false } }, { multi: true })
      .exec();
  }
  next();
});
*/

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
    recipe: {
      operations: [OperationSchema]
    },
    tags: [{ tag: String }]
  },
  { timestamps: true, toJSON: { getters: true } }
);

ProductSchema.index({ name: 1, type: -1 });
ProductSchema.index({ category: 1, type: -1 });
ProductSchema.index({ tags: 1, type: -1 });

export default mongoose.model('Product', ProductSchema);
