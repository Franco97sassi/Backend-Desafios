document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".landing-form");
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      try {
        const email = document.getElementById("email").value;
        const response = await fetch("/api/session/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Se envió un correo para reestablecer la contraseña",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "/login";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Tuvimos un problema!",
            text: data.error,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });