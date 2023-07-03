
const socket = io()

const title = document.getElementById("title")
const description = document.getElementById("description")
const price = document.getElementById("price")
const code = document.getElementById("code")
const stock = document.getElementById("stock")
const category = document.getElementById("category")
const btnAgregar = document.getElementById("btnAgregar")

const socketId = document.getElementById("socketId") 
const btnEliminar = document.getElementById("btnEliminar")

btnAgregar.addEventListener("click", () => {
    let product = {
      title: title.value,
      description: description.value,
      price: price.value,
      code: code.value,
      stock: stock.value,
      category: category.value
    };
    socket.emit("createProduct", product);
  });

  socket.on("resp-new-product", (data)=>{
    let productos = document.getElementById("productos")
    if (data.length > 0) {
      data.forEach(product => {
        let card = document.createElement("div")
        let cardTitle = document.createElement("h2")
        let cardDescription = document.createElement("p")
        let cardPrice = document.createElement("p")
        let cardCode = document.createElement("p")
        let cardStock = document.createElement("p")
        let cardCategory = document.createElement("p")

        cardTitle.innerText = product.title
        cardDescription.innerText = product.description
        cardPrice.innerText = "Precio: $" + product.price
        cardCode.innerText = "Codigo: " + product.code
        cardStock.innerText = "Stock: " + product.stock
        cardCategory.innerText = "Categoria: " + product.category

        card.classList.add("card", "border", "border-3", "cardRealTime", "text-center");
        cardTitle.classList.add("card-title");
        cardDescription.classList.add("card-text", "fs-6", "fw-bold");
        cardPrice.classList.add("card-text", "fs-6", "fw-bold");
        cardCode.classList.add("card-text", "fs-6", "fw-bold");
        cardStock.classList.add("card-text", "fs-6", "fw-bold");
        cardCategory.classList.add("card-text", "fs-6", "fw-bold");

        card.appendChild(cardTitle);
        card.appendChild(cardDescription);
        card.appendChild(cardPrice);
        card.appendChild(cardCode);
        card.appendChild(cardStock);
        card.appendChild(cardCategory);

        productos.appendChild(card);
      });
    }else {
      let noProdcuts = document.createElement("h2")
      noProdcuts.innerText = "No tienes productos agregados."
      noProdcuts.classList.add("text-light");
      productos.appendChild(noProdcuts)
    } 
  })

  btnEliminar.addEventListener("click", ()=>{
    let pid = socketId.value;
    socket.emit("deleted-product", pid)
  })