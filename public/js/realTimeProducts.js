const socket = io();
socket.on("connect", () => {});
socket.on("productAddError", (error) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Ingresa un CODE diferente",
  });
});

socket.on("productAddSuccess", () => {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("price").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("thumbnails").value = "";
});

let log = document.getElementById("productList");

const addProd = document.getElementById("addProduct");
addProd.addEventListener("click", (e) => {
  e.preventDefault();
  if (e) {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const owner = "admin";
    const newProd = {
      title,
      description,
      category,
      price,
      code,
      stock,
      thumbnails,
      owner,
    };
    socket.emit("product", newProd);
  }
});

const deletProduct = document.getElementById("deletProduct");
deletProduct.addEventListener("click", (e) => {
  e.preventDefault();
  if (e) {
    const delProduct = document.getElementById("pid").value;
    socket.emit("productDelete", delProduct);
  }
  document.getElementById("pid").value = "";
});

socket.on("productDeleteError", (errorMessage) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Ingresa un CODE diferente",
  });
});

socket.on("productList", (data) => {
  let productListHTML = "";
  let products = data;
  products.forEach((prod) => {
    productListHTML += `
        <tr>
          <td>${prod._id}</td>
          <td>${prod.title}</td>
          <td>${prod.description}</td>
          <td>${prod.category}</td>
          <td>${prod.price}</td>
          <td>${prod.code}</td>
          <td>${prod.stock}</td>
          <td>${prod.status}</td>
          <td>
            <img
              width="100px"
              src="${prod.thumbnails}"
              alt="${prod.title}"
            /></td>
          </tr>
          </tr>

        `;
  });
  const productListContainer = document.getElementById("productList");
  productListContainer.innerHTML = productListHTML;

  Swal.fire({
    icon: "success",
    title: "Productos actualizados correctamente",
    showConfirmButton: false,
    timer: 1500,
  });
});