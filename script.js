const ws = new WebSocket('ws://localhost');
localStorage.setItem('accessToken', '');
ws.onopen = function(){
    const token = localStorage.getItem('accessToken');
    SendToServer('auth', token)
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

const SendToServer = (route, data = null) =>{
    ws.send(JSON.stringify({ route, data: data }));
}

const test = async () =>{
    try{
        console.log('test')
        const res = await axios.get('http://localhost:80/');
        console.log(res)
    }catch(e){
        console.log(e)
    }
}

const GetImage = async () =>{
    const result = await axios.post('http://localhost:80/getCaptcha');
    const captchaBlock = document.getElementById('captchaBlock');
    const parser = new DOMParser();
    console.log('id: ', result.data.id);
    const svg = parser.parseFromString(result.data.captcha, "image/svg+xml").documentElement;
    captchaBlock.appendChild(svg);
}