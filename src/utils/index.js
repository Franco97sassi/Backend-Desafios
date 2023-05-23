export const validateProduct=(product)=>{
    let validate  ;
    if(!product.title|| !product.description|| !product.code|| 
        !product.status|| !product.stock|| !product.category
        ){validate=true}else{
            validate=false
    }
    return validate;
}