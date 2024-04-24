const errorHandler = (error, req, res, next) => {
  // Log the error to the console
  console.error('Error:', error);

  // Set status code and send error response
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
    status: 'error',
  });
};

export default errorHandler;
