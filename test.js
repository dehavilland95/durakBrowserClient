const ws = new WebSocket('ws://localhost');

ws.onopen = function(){

}

ws.onmessage = function(data){
  
}

ws.onclose = function(){
    console.log('Connected closed');
}

ws.onerror = function(e){
    console.log('Error: ', e);
}

const SendToServer = (route, data = null) =>{
    ws.send(JSON.stringify({ route, data: data }));
}