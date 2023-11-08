document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cidElement = document.querySelector(".cartID");
  const cid = cidElement.textContent.trim(); // Obtiene solo el texto y elimina espacios en blanco al principio y al final
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      let cartID = cidElement.value;
      addToCart(productId, cartID);
    });
  });
});

async function addToCart(productId, cid) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  try {
    const response = await fetch(`api/cart/${cid}/product/${productId}`, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      Toast.fire({
        icon: "success",
        title: "Producto agregado al carrito",
      });
    } else {
      const errorData = await response.json();
      Toast.fire({
        icon: "error",
        text: "Hubo un problema al agregar el producto",
        footer: `<b>${errorData.msg}</b>`,
      });
      console.error(errorData);
    }
  } catch (error) {
    console.error(error);
  }
}