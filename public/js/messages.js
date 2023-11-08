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
      messages += `
        <div class="flex mb-4 ${message.user === "Tú" ? "justify-end" : ""}">
          <div class="flex-shrink-0">
            <img src="${
              message.user === "Tú" ? "your-avatar.jpg" : "img/avatar.png"
            }" alt="Avatar" class="w-10 h-10 rounded-full" />
          </div>
          <div class="${message.user === "Tú" ? "mr-3" : "ml-3"} ${
        message.user === "Tú" ? "bg-green-100" : "bg-blue-100"
      } p-3 rounded-lg">
            <p class="text-sm font-medium ${
              message.user === "Tú" ? "text-green-800" : "text-blue-800"
            }">${message.user}</p>
            <p class="text-sm text-gray-700">${message.message}</p>
          </div>
        </div>`;
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