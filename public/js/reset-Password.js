document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".landing-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      Swal.fire("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
      return;
    }

    try {
      const response = await fetch("/api/session/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Has cambiado tu contraseña",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        if (data.error === "Token inválido o expirado") {
          Swal.fire({
            icon: "error",
            title: "Token inválido o expirado",
            text: "Por favor, solicita un nuevo enlace de restablecimiento de contraseña.",
          }).then(() => {
            window.location.href = "/forgot-password";
          });
          return;
        }
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