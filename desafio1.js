class ProductManager{
    constructor(){
        this.products=[]
    }
    generateId=()=>{
         if(this.products.length==0) return 1;{
            return this.products[this.products.length-1].id+1;}
         }
    addProduct(title,descripcion,price,thumbnail,code,stock){
        const id=this.generateId();
        const product= {id,title,descripcion,price,thumbnail,code,stock};

        if(!title|| !descripcion || !price || !thumbnail || !code || !stock){
            return console.log("Faltan datos")
        }

        if(this.products.some(elem=>elem.code==code)){
            return console.log( `Codigo ${code} repetido` )
        }
        this.products.push(product);
}

getProductsById=(id)=>{
    const product=this.products.find(elem=>elem.code===id);
    if(!product){
        return console.log("No se encontro el producto")
    }
    return product;
}
getProducts=()=>{
    return this.products;
}
}
const manager=new ProductManager()
manager.addProduct("Motorola G22","Tamaño de la pantalla: 6.5...",67000,"https://i.imgur.com/EsxY88d.jpg",1234,7)
manager.addProduct("Tablet Samsung A8","Sistema operativo: Android...",112000,"https://i.imgur.com/365TQnk.jpg",5678,10)

const products= manager.getProducts();
console.log(products);

const product= manager.getProductsById(1234);
console.log(product);

const productNotFound=manager.getProductsById(0);
console.log(productNotFound);

//desafio2
const fs=require("fs");
const fillname= "productos.txt";
const obj=manager

fs.writeFileSync(fillname,JSON.stringify(obj,null,"\t"))
const contenido=JSON.parse(fs.readFileSync(fillname,"utf-8"))
contenido.precio=1000
fs.writeFileSync(fillname,JSON.stringify(contenido,null,"\t"))