import handlebars from "handlebars";

export const multiplyHelper = function (a, b) {
  return (a * b).toFixed(2);
};

export const calculateTotal = function (products) {
  let total = 0;
  products.forEach((product) => {
    total += product._id.price * product.quantity;
  });
  return total.toFixed(2);
};

handlebars.registerHelper("multiply", multiplyHelper);
handlebars.registerHelper("calculateTotal", calculateTotal);