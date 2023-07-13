export const validateAddProduct = (product) => {
  let result = true;

  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.stock ||
    !product.category
  ) {
    result = false;
  }

  return result;
};
