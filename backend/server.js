import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import productRoutes from './routes/productRoutes.js';
import colors from 'colors';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:5500'
        : 'http://ldanieldev.com'
  })
);
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`server started on port ${port}`));
