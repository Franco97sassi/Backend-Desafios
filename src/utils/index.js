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

 export const calculateTotalAmount=(productsToPurchase)=>{
  let totalAmount=0;
  for (const product of productsToPurchase) {
    totalAmount+=product.price*product.quantity
  }
  return totalAmount
 }

 export const generateUniqueCode=()=>{
  const timestamp=Date.now()
  const randomSuffix=Math.floor(Math.random()*1000)
  const code=`ORDER-${timestamp}-${randomSuffix}`
  return code
 }