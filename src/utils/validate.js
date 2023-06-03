export const validate = (product)=>{
    let validate;
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        validate = false;
    }else {
        validate = true;
    }
    return validate;
}