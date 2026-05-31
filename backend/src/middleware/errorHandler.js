const errorHandler = (err, req, res, next) => {
  console.error('--- Error ---');
  console.error(err);

  let errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  let statusCode = err.statusCode || 500;

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    errorResponse.message = `Invalid ID format: ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.message = 'Validation failed';
    errorResponse.errors = Object.values(err.errors).map(val => val.message);
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    errorResponse.message = `${field} already exists`;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
