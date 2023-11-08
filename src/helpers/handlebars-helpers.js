import handlebars from "handlebars";

const ifEqHelper = function (a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
};

handlebars.registerHelper("if_eq", ifEqHelper);

export default ifEqHelper;