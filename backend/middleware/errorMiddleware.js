const errorHandler = (err, req, res, next) => {
  const statusCode = res.statuscode ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

export default errorHandler;
