import expressAsyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/productModel.js';

const deleteImage = (publicId) =>
  cloudinary.uploader.destroy(publicId, function (error, result) {
    //console.log(result, error);
  });

const errorHandler = (statusMsg, image) => {
  if (image) {
    let publicId = image.filename;
    deleteImage(publicId);
  }

  throw new Error(statusMsg);
};

/**
 * Get Products
 * @route       GET /api/products
 * @param req   request
 * @param res   response
 * @returns     JSON list of products
 * @private
 */
const getProducts = expressAsyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

/**
 * Get a Product by Id
 * @route       GET /api/products/:id
 * @param req   request
 * @param res   response
 * @returns     JSON list of products
 * @private
 */
const getProductById = expressAsyncHandler(async (req, res) => {
  const products = await Product.findOne({ _id: req.params.id });
  res.status(200).json(products);
});

/**
 * Set Product
 * @route       POST /api/products
 * @param req   request
 * @param res   response
 * @returns     JSON list of products
 * @private
 */
const setProduct = expressAsyncHandler(async (req, res) => {
  const { name, category, recipe } = req.body;
  const image = req.file;

  if (image) {
    req.body.image = image.url;
  }

  if (!name) {
    res.status(400);
    throw new Error('Please add a name parameter');
  }
  if (!category) {
    res.status(400);
    errorHandler('Please add a category parameter', image);
  }

  if (!recipe || recipe === null || typeof recipe !== 'object') {
    res.status(400);
    errorHandler('Please add a recipe parameter', image);
  }

  if (recipe.length < 1) {
    res.status(400);
    errorHandler('Please add an operations array of objects parameter', image);
  }

  const stepOrdersExists = recipe.every(
    (step) => step.order && !isNaN(step.order)
  );

  if (!stepOrdersExists) {
    res.status(400);
    errorHandler('Please add an order number for each recipe step', image);
  }

  const stepDescriptionsExists = recipe.every((step) => step.description);

  if (!stepDescriptionsExists) {
    res.status(400);
    errorHandler(
      'Please add a description parameter for each recipe step',
      image
    );
  }

  const stepTargetExists = recipe.every(
    (step) => step.target && !isNaN(step.target)
  );

  if (!stepTargetExists) {
    res.status(400);
    errorHandler('Please add a target parameter for each operation', image);
  }

  const stepTargetUomExists = recipe.every((step) => step.targetUom);

  if (!stepTargetUomExists) {
    res.status(400);
    errorHandler(
      'Please add a target unit of measure parameter for each operation',
      image
    );
  }

  const product = await Product.create(req.body);
  res.status(200).json(product);
});

/**
 * Update Product
 * @route       PUT /api/products/:id
 * @param req   request
 * @param res   response
 * @returns     JSON data of updated product
 * @private
 */
const updateProduct = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error('Please provide a product ID number');
  }

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json(updatedProduct);
});

/**
 * Delete Product
 * @route       DELETE /api/products/:id
 * @param req   request
 * @param res   response
 * @returns     JSON deleted product id
 * @private
 */
const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { image } = req.body;

  await Product.findOneAndRemove({ _id: req.params.id });

  if (image) {
    let publicId = image.split('/').pop().split('.')[0];
    deleteImage('bakeryApp/products/' + publicId);
  }

  res.status(200).json({ id: req.params.id });
});

export {
  getProducts,
  getProductById,
  setProduct,
  updateProduct,
  deleteProduct
};
