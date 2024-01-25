const ws = new WebSocket('ws://localhost');

ws.onopen = function(){
    console.log('Connected to server');
}

ws.onmessage = function(data){
    console.log('message');
    console.log(data);
}

ws.onclose = function(){
    console.log('Connected closed');
}

ws.onerror = function(e){
    console.log('Error: ', e);
}

const SendToServer = (data) =>{
    ws.send(JSON.stringify({ data: data }));
}