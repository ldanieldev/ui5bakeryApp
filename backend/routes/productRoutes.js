import express from 'express';
import upload from '../config/multer.js';
import {
  getProducts,
  getProductById,
  setProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts).post(upload.single('image'), setProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
