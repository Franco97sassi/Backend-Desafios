const socket = io();

function purchase(cid) {
  Swal.fire({
    title: "Realizar compra",
    text: "¿Quieres realizar la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("purchase", cid);
    }
  });
}

socket.on("purchase-success", (data) => {
  window.location.href = `${data.url}`;
});

socket.on("purchase-cancel", (data) => {
  Swal.fire({
    title: "Compra cancelada",
    text: "Ocurrio un error al procesar la compra",
    icon: "error",
  });
});

function getCIDFromURL() {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[2];
}

const cid = getCIDFromURL();

function deleteProduct(pid) {
  fetch(`/api/cart/${cid}/product/${pid}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el producto",
        text: error.message,
      });
    });
}