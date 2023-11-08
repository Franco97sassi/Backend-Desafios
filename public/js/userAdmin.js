function changeUserRole(uid) {
    fetch(`/api/users/premium/${uid}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "successful") {
          Swal.fire({
            icon: "success",
            title: "Rol cambiado exitosamente",
            text: data.msg,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.msg,
            confirmButtonText: "Cerrar",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al cambiar el rol del usuario",
          confirmButtonText: "Cerrar",
        });
      });
  }
  
  function deleteInactiveUsers() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará a todos los usuarios inactivos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/users", {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar usuarios inactivos");
            }
            return response.json();
          })
          .then((data) => {
            if (data.payload && data.payload.length > 0) {
              Swal.fire({
                icon: "success",
                title: "Usuarios eliminados",
                text: `Los usuarios ${data.payload.join(
                  ", "
                )} han sido eliminados correctamente.`,
                confirmButtonText: "Cerrar",
              }).then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "info",
                title: "Ningún usuario eliminado",
                text: "No se encontraron usuarios inactivos para eliminar.",
                confirmButtonText: "Cerrar",
              });
            }
          });
      }
    });
  }
  
  function deleteUser(userId) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/users/${userId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar usuario");
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: "Usuario eliminado",
              text: `El usuario ${data.payload} han sido eliminados correctamente.`,
              confirmButtonText: "Cerrar",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.message,
              confirmButtonText: "Cerrar",
            });
          });
      }
    });
  }