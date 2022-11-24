const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', messsage => {
    console.log(messsage)
});

//Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();  //When you submit a form, it automatically it just submits to a file. But obviously we don't want it.

    //Get message text(When we submit the form, it should get the message from the text input)
    const msg = e.target.elements.msg.value;  //Basically, we're getting the message by it's id(Check the chat.html's input-id "msg")

    //Emit message to server
    socket.emit('chatMessage', msg);

})