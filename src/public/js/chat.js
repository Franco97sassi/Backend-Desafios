const socket = io();
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa un nombre",
    inputValidator: (value) => {
        return !value && 'Necesitas ingresar un nombre obligatoriamente'
    }
}).then(result => {
    user = result.value;
    return user;
}   
).then(user => socket.emit("newUserLoged", { user }))
.catch(error => console.log(error))

chatBox.addEventListener('keyup', evento => {
    if(evento.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user, message: chatBox.value});
            chatBox.value = "";
        }
    }
} 
)
socket.on('messages', data => {
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(msg => {
        messages = messages + `${msg.user} dice: ${msg.message}</br>`
    });
    log.innerHTML = messages;
    
 } 
)
socket.on('newUser', user =>{
    Swal.fire({
        text: `Nuevo usuario conectado: ${user.user}`,
        toast: true,
        position: 'top-right'
    }
    )
}    
)
