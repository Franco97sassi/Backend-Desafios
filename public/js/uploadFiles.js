document
  .getElementById("documentUploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    fetch(`/api/users/${formData.get("uid")}/documents`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar documentos");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Documentos cargados exitosamente",
          text: "Los documentos se han cargado correctamente.",
          showConfirmButton: false,
          timer: 1500,
        });
        // Limpiar el formulario
        this.reset();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "Cerrar",
        });
      });
  });