import {faker} from "@faker-js/faker"

export const generateproduct=()=>{
    return {
        id:faker.database.mongodbObjectId(),
        title:faker.commerce.productName(),
        category:faker.commerce.department(),
        price:faker.commerce.price(),
        code:faker.string.alphanumeric(15),
        stock:faker.number.int({min:10,max:35}),
        status:true,
        thumbnails:faker.image.url()

    }
}
export const generateproducts=(quantity)=>{
    const products=[];
    for (let i = 0; i < quantity; i++) {
        products.push(generateproduct());
    }
    return products 
}