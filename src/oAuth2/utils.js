const handleError = (error, message) => {
  console.error(error);
  throw new Error(message);
};

module.exports = {
  handleError,
};
