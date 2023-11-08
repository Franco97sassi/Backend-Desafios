document.addEventListener("DOMContentLoaded", function () {
  const purchaseButtons = document.querySelectorAll(".purchase-btn");
  purchaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      purchase();
    });
  });
});

async function getCartIdFromServer() {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
    });
    const data = await response.json();
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
  return cartId;
}

async function purchase() {
  const cartId = await getCartId();
  fetch(`/api/cart/${cartId}/purchase`, {
    method: "POST",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error al finalizar la compra");
    })
    .then(function (data) {
      if (data.client_secret) {
        window.location.href = `/api/payments/checkout?client_secret=${data.client_secret}`;
        console.error("Error: No se recibió un client_secret");
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}