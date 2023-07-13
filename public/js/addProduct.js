document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      addToCart(productId);
    });
  });
});

async function addToCart(productId) {
  const cartId = await getCartId();
  fetch(`api/cart/${cartId}/product/${productId}`, {
    method: "POST",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error en la solicitud de agregar al carrito");
    })
    .then(function (data) {
      Swal.fire({
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 750,
      });
      console.log(data);
    })
    .catch(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un problema al agregar el producto",
      });
      console.error(error);
    });
}

async function getCartIdFromServer() {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
    });
    const data = await response.json();
    let contenedorID = document.getElementsByClassName("cart-id")[0];
    contenedorID.innerHTML = `<a href="http://localhost:8080/carts/${data.cartId}">${data.cartId}</a>`;
    return data.cartId;
  } catch (error) {
    console.error("Error al obtener el ID del carrito:", error);
    throw error;
  }
}

function getCartId() {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    return getCartIdFromServer()
      .then(function (cartId) {
        localStorage.setItem("cartId", cartId);
        return cartId;
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un problema al generar el carrito",
        });
        console.error(error);
        throw error;
      });
  }
  let contenedorID = document.getElementsByClassName("cart-id")[0];
  contenedorID.innerHTML = `<a href="http://localhost:8080/carts/${cartId}">${cartId}</a>`;
  return Promise.resolve(cartId);
}
