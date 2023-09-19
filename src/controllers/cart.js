import CartManager from "../DAO/cartsDAO.js";
const manager = new CartManager();

export const getCart = async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await manager.getCart(cid);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        msg: "El carrito no existe",
      });
    }

    res.send({
      status: "successful",
      products: cart.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener el carrito",
    });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.send({ status: "successful", carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener los carritos",
    });
  }
};

export const addProductToCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const result = await manager.addProductToCart(pid, cid);

    if (!result.success) {
      return res.status(404).send({
        status: "error",
        msg: result.message,
      });
    }

    res.send({
      status: "successful",
      msg: result.message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al agregar el producto al carrito",
    });
  }
};

export const createCart = async (req, res) => {
  try {
    let cart = await manager.createCart();
    if (!cart) {
      return res
        .status(500)
        .send({ status: "error", msg: "No se pudo crear el carrito" });
    }
    res.send({
      status: "successful",
      cartId: cart._id,
      msg: "Carrito creado correctamente",
    });
    console.log(cart);
  } catch (error) {
    throw error;
  }
};

export const deleteProductFromCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cart = await manager.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await manager.deleteProductFromCart(pid, cid);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    res.send({
      status: "successful",
      msg: "Producto eliminado del carrito correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al eliminar el producto del carrito",
    });
  }
};

export const updateCart = async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await manager.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await manager.updateCart(cid, products);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    res.send({
      status: "successful",
      msg: "Carrito actualizado correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", msg: "Error al actualizar el carrito" });
  }
};

export const updateProductQuantity = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  const updateResult = await manager.updateProductQuantity(cid, pid, quantity);

  if (!updateResult.success) {
    return res.status(404).send({
      status: "error",
      message: updateResult.message,
    });
  }

  res.send({
    status: "success",
    message: updateResult.message,
    cart: updateResult.cart,
  });
};

export const deleteAllProducts = async (req, res) => {
  const cid = req.params.cid;

  const deleteResult = await manager.deleteAllProducts(cid);

  if (!deleteResult.success) {
    return res.status(404).send({
      status: "error",
      message: deleteResult.message,
    });
  }

  res.send({
    status: "success",
    message: deleteResult.message,
  });
};