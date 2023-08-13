import bcrypt from "bcrypt";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
}



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

