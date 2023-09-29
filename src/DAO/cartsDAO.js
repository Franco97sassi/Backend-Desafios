import { cartsModel } from "./db/model/carts.model.js";
import { productsModel } from "./db/model/products.model.js";
import ProductManager from "./productsDAO.js"
class CartManager {
  constructor() {
    this.model = cartsModel;
  }

  async getCarts() {
    try {
      const carts = await this.model.find().populate("products._id");
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async getCart(id) {
    try {
      const cart = await this.model.findById(id).populate("products._id");

      if (!cart) {
        console.log(`No se encontró ningún carrito con el id: ${id}`);
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(pid, cid) {
    try {
      const product = await productsModel.findById(pid);

      if (!product) {
        return {
          success: false,
          message: "El producto no existe",
        };
      }

      const updatedCart = await this.model.findOneAndUpdate(
        { _id: cid, "products._id": pid },
        { $inc: { "products.$.quantity": 1 } }
      );

      if (!updatedCart) {
        const newProduct = {
          _id: pid,
          quantity: 1,
        };

        await this.model.findByIdAndUpdate(cid, {
          $push: { products: newProduct },
        });

        return {
          success: true,
          message: "Producto agregado al carrito",
        };
      }

      return {
        success: true,
        message: "Producto agregado al carrito",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al agregar el producto al carrito",
      };
    }
  }

  async createCart() {
    try {
      const newCart = {
        products: [],
      };
      const createdCart = await this.model.create(newCart);
      return createdCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(pid, cid) {
    try {
      const cart = await this.model.findById(cid);

      if (!cart) {
        return {
          success: false,
          message: "El carrito no existe",
        };
      }

      cart.products = cart.products.filter(
        (product) => product._id.toString() !== pid
      );

      await cart.save();

      return {
        success: true,
        message: "Producto eliminado del carrito",
        cart,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al eliminar el producto del carrito",
      };
    }
  }

  async updateCart(cid, products) {
    try {
      const filter = { cid };
      const update = { products };
      const options = { new: true };

      const updatedCart = await this.model.findByIdAndUpdate(
        cid,
        update,
        options
      );

      if (!updatedCart) {
        return {
          success: false,
          message: "Carrito no encontrado",
        };
      }

      return {
        success: true,
        message: "Carrito actualizado",
        cart: updatedCart,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al actualizar el carrito",
      };
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const filter = { _id: cid, "products._id": pid };
      const update = { $set: { "products.$.quantity": quantity } };

      const updatedCart = await this.model.findOneAndUpdate(filter, update, {
        new: true,
      });

      if (!updatedCart) {
        return {
          success: false,
          message:
            "Carrito no encontrado o producto no encontrado en el carrito",
        };
      }

      return {
        success: true,
        message: "Cantidad de producto actualizada en el carrito",
        cart: updatedCart,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al actualizar la cantidad de producto en el carrito",
      };
    }
  }

  async deleteAllProducts(cid) {
    try {
      const filter = { _id: cid };
      const update = { $set: { products: [] } };

      const updatedCart = await this.model.updateOne(filter, update);

      if (updatedCart.modifiedCount === 0) {
        return {
          success: false,
          message: "No se encontró ningún carrito con el id especificado",
        };
      }

      return {
        success: true,
        message: "Productos eliminados del carrito correctamente",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al eliminar los productos del carrito",
      };
    }
  }

  async verifyPurchase(cid) {
    try {
      const cart = await this.model.findById(cid)
      const productsToPurchase = [];
      const productsNotPurchase = [];
      for (const product of cart.products) {
        const productData = await productsModel.findById(product._id)
        if (productData.stock >= product.quantity) {
          const productToPurchase = {
            _id: product._id,
            price: productData.price,
            quantity: product.quantity
          }
          productsToPurchase.push(productToPurchase)
        } else {
          productsNotPurchase.push(product)
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Ocurrio un error al verificar la compra`
      }
    }
  }
  async processPurchase(productsToPurchase) {
    try {
      for (const product of productsToPurchase) {
        const productData = await productsModel.findById(product._id)
        const newStock = productData.stock - product.quantity
        await productsModel.updateOne(
          { _id: product._id },
          { stock: newStock }
        )
      }
      return {
        success: true,
        message: "productos procesados exitosamente"
      }
    } catch (error) {
      return {
        success: false,
        message: "ocurrio un error al actualizar stock"
      }
    }
  }
  async unprocessedProducts(cid, productsNotPurchase) {
    try {
      if (!productsNotPurchase || productsNotPurchase.length === 0) {
        return {
          success: true,
          message: "no hay productos no comprados para eliminar del carrito"
        }

      }
      const productIdsNotPurchase = productsNotPurchase.map(
        (product) => product._id
      )
      const updatedCart = await this.model.findByIdAndUpdate(cid,
        { $pull: { products: { _id: { $in: productIdsNotPurchase } } } }, { new: true })

      if (!updatedCart) {
        console.log("carrito no encontrado");
      }
      return {
        success: true,
        message: "productos no comprados eliminados del carrito exitosamente"
      }


    } catch (error) {
      return {
        success: false,
        message: "ocurrio un error al actualizar el carrito"
      }
    }
  }

}

export default CartManager;
