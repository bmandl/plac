const errorHandler = (response, errorText) => {
  if (!response.ok) {
    throw new Error(errorText);
  }
  return response;
};

export default errorHandler;
