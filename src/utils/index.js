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

export const createHash= password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) 
export const validatePassword=(user,password)=>{
  return true
}
 export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);