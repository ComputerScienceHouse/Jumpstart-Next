var updateWebSocket = new WebSocket('ws://'+window.location.host+'/api/ws');
updateWebSocket.addEventListener('message', function (e) {
    var event = new Event(JSON.parse(e.data).message);
    updateWebSocket.dispatchEvent(event);
});

export { updateWebSocket };