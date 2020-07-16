const socket = new WebSocket('ws://localhost:8088/ws/');

socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ api: "get_newly_released" }));
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

export default {};