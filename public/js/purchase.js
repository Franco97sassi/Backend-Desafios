document.addEventListener("DOMContentLoaded", function () {
    const purchaseButtons = document.querySelectorAll(".purchase-btn")
    purchaseButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            purchase()
        })
    })
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

function getCartId(){
    let cartId=localStorage.getItem("cartId")
    if(!cartId){
        return getCartIdFromServer()
        .then (function(cartId){
            localStorage.setItem("cartId",cartId)
            return cartId
        })
        .catch(function(error){
            Swal.fire({
                icon:"error",
                title:"oops",
                text:"hubo un problema al generar el carrito"
            })
            console.error(error)
            throw error
        })

    }
    return cartId
}
async function purchase(){
    const cartId=await getCartId()
     fetch(`/api/cart/${cartId}/purchase`,{
        method:"POST"
    })
    .then(function(response){
        if(response.ok){
            return response.json()

        }
        throw new Error("error al finalizar compra")
    })
    .then(function(data){
        Swal.fire({
            icon:"success",
            title:"compra finalizada",
            showConfirmButton:true,
            footer:`<p> tu numero de orden es:${data.payload.code}.</p> <a href="/carts/${cartId}/${data.payload.code}">Haga click para ver su compra </a>`
        })
    })
    .catch(function(error){
        Swal.fire({
            icon:"error",
            title:"oops",
            text:"hubo un problema al terminar la compra",
            footer:error
        })
        console.error(error)
    })
}