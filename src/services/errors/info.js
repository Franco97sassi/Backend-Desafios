export const generateProductsErrorInfo = (product) => {
    return `Una o mas propiedades estan incompletas o no son validas.  
      La lista de propiedades requeridas son: 
      * Título: debe ser un string, se recibió ${product.title}
      * Descripción: debe ser un string, se recibió ${product.description}
      * Categoría: debe ser un string, se recibió ${product.category}
      * price: debe ser un number, se recibió ${product.price}
      * Código: debe ser un string único, se recibió ${product.code}
      * Stock: debe ser un number, se recibió ${product.stock}`;
  };