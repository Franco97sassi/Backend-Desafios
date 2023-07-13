const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa el usuario para identificarte",
  inputValidator: (value) => {
    return !value && "Necesitas identificarte para ingresar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";

  if (Array.isArray(data)) {
    for (let i = data.length - 1; i >= 0; i--) {
      const message = data[i];
      messages += `<b>${message.user.toUpperCase()}</b>: ${
        message.message
      } <br>`;
    }
  } else {
    console.error("El objeto data no es un array");
  }

  log.innerHTML = messages;
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("messages", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});
