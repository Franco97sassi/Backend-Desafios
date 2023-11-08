import bcrypt from "bcrypt";

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

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const calculateTotalAmount = (productsToPurchase) => {
  if (!Array.isArray(productsToPurchase)) {
    productsToPurchase = [productsToPurchase];
  }
  let totalAmount = 0;
  for (const product of productsToPurchase) {
    totalAmount += product.price * product.quantity;
  }

  totalAmount = totalAmount.toFixed(2);

  return totalAmount;
};

export const generateUniqueCode = () => {
  const timestamp = Date.now();
  const ramdomSuffix = Math.floor(Math.random() * 1000);
  const code = `ORDER-${timestamp}-${ramdomSuffix}`;
  return code;
};