const cardsNames = { 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'Валет', 12: 'Дама', 13: 'Король', 14: 'Туз' };
const suits = { 's': 'spades.png', 'd': 'diamonds.png', 'h': 'hearts.png', 'c': 'clubs.png' };
const createPlayer = (id) =>{
    return {
        ws: null,
        id: id,
        position: 'player1',
        action: null,
        myPosition: null,
        routes: {
            context: null,
            youSatDown: function(data){
                //console.log('youSatDown: ');
                //console.log(this.context)
            },
            cardsUpdate: function(data){
                const handsBlock = document.getElementById('hands' + this.context.id);
                removeChildrenRecursive(handsBlock);
                if(data.length === 0) return;
                for(let i = 0; i < data.length; i++){
                    const button = document.createElement('button');
                    const p = document.createElement('p');
                    const img = document.createElement('img');
                    button.onclick = () => this.context.doAction(data[i].title);
                    p.innerText = cardsNames[data[i].power];
                    img.src = './assets/' + suits[data[i].suit];
                    img.className = 'suit';
                    button.appendChild(p);
                    button.appendChild(img);
                    handsBlock.appendChild(button);
                }
            },
            update: function(data){
                //console.log('update');
                this.context.updateTable(data.cardsOnTable);
                this.context.updateDeck(data.trump, data.cardsInDeckCount);
                this.context.updateAction(data.action);
                this.context.updateUI(data);
                this.context.updateInfo(data.whoseAttack, data.whoseDefense);
            },
            error: function(data){
                console.log('Ошибка');
                console.log(data)
            }
        },
        updateUI: function(data){
            if(data.action === 'attack'){
                if(`player${this.id}` === data.whoseAttack){
                    const iPickUpButton = document.getElementById(`iPickUp${this.id}Button`);
                    iPickUpButton.disabled = true;
                    const beatButton = document.getElementById(`beat${this.id}Button`);
                    if(data.sayIPickUp || data.cardsOnTable.defense.length === 0){
                        beatButton.disabled = true;
                    }else{
                        beatButton.disabled = false;
                    }
                    const skipButton = document.getElementById(`skip${this.id}Button`);
                    if(data.cardsOnTable.attack.length === 0 || !data.sayIPickUp){
                        skipButton.disabled = true;
                    }else{
                        skipButton.disabled = false;
                    }
                    const screen = document.getElementById(`screen${this.id}`);
                    screen.style.background = 'none';
                }else{
                    const iPickUpButton = document.getElementById(`iPickUp${this.id}Button`);
                    iPickUpButton.disabled = true;
                    const beatButton = document.getElementById(`beat${this.id}Button`);
                    beatButton.disabled = true;
                    const skipButton = document.getElementById(`skip${this.id}Button`);
                    skipButton.disabled = true;
                    const screen = document.getElementById(`screen${this.id}`);
                    screen.style.backgroundColor = 'gray';
                }
            }else{
                if(`player${this.id}` === data.whoseDefense){
                    const iPickUpButton = document.getElementById(`iPickUp${this.id}Button`);
                    iPickUpButton.disabled = false;
                    const beatButton = document.getElementById(`beat${this.id}Button`);
                    beatButton.disabled = true;
                    const skipButton = document.getElementById(`skip${this.id}Button`);
                    skipButton.disabled = true;
                    const screen = document.getElementById(`screen${this.id}`);
                    screen.style.background = 'none';
                }else{
                    const iPickUpButton = document.getElementById(`iPickUp${this.id}Button`);
                    iPickUpButton.disabled = true;
                    const beatButton = document.getElementById(`beat${this.id}Button`);
                    beatButton.disabled = true;
                    const skipButton = document.getElementById(`skip${this.id}Button`);
                    skipButton.disabled = true;
                    const screen = document.getElementById(`screen${this.id}`);
                    screen.style.backgroundColor = 'gray';
                }
            }
        },
        updateAction: function(newAction){
            this.action = newAction;
        },
        updateInfo: function(attack, defense){
            console.log(`screenInfo${this.id}`)
            const info = document.getElementById(`screenInfo${this.id}`);
            //console.log({info});
            //console.log(`screen${this.id}_info`)
            info.innerText = `Ходит ${attack}, бьется ${defense}`
        },
        updateDeck: function(trump, cardsInDeckCount){
            //console.log('updateDeck')
            //console.log(trump)
            //console.log(cardsInDeckCount)
            const deckBlock = document.getElementById(`deckBlock${this.id}`);
            removeChildrenRecursive(deckBlock);
            const button = document.createElement('button');
            const p = document.createElement('p');
            const img = document.createElement('img');
            p.innerText = cardsInDeckCount;
            img.src = './assets/' + suits[trump];
            img.className = 'suit';
            button.disabled = true;
            button.appendChild(p);
            button.appendChild(img);
            deckBlock.appendChild(button);
        },
        updateTable: function(data){
            console.log('updateTable: ', this.id);
            const tableAttackBlock = document.getElementById(`table${this.id}_attack`);
            const tableDefenseBlock = document.getElementById(`table${this.id}_defense`);
            removeChildrenRecursive(tableAttackBlock);
            removeChildrenRecursive(tableDefenseBlock);
            for(let i = 0; i < data.attack.length; i++){
                const button = document.createElement('button');
                const p = document.createElement('p');
                const img = document.createElement('img');
                p.innerText = cardsNames[data.attack[i].power];
                img.src = './assets/' + suits[data.attack[i].suit];
                img.className = 'suit';
                button.disabled = true;
                button.appendChild(p);
                button.appendChild(img);
                tableAttackBlock.appendChild(button);
            }
            for(let i = 0; i < data.defense.length; i++){
                const button = document.createElement('button');
                const p = document.createElement('p');
                const img = document.createElement('img');
                p.innerText = cardsNames[data.defense[i].power];
                img.src = './assets/' + suits[data.defense[i].suit];
                img.className = 'suit';
                button.disabled = true;
                button.appendChild(p);
                button.appendChild(img);
                tableDefenseBlock.appendChild(button);
            }
        },
        doAction: function(card){
            //console.log('doAction: ', this.action)
            //console.log(card)
            this.sendToServer(this.action, card)
        },
        sendToServer: function(route, data){
            this.ws.send(JSON.stringify({ route, data: data }));
        },
        auth: function(){
            //console.log(this)
            this.sendToServer('auth', this.id);
        },
        sitDown: function() {
            this.sendToServer('sitDown', this.id);
        },
        iPickUp: function() {
            this.sendToServer('iPickUp');
        },
        beat: function() {
            this.sendToServer('beat');
        },
        skip: function(){
            this.sendToServer('skip');
        },
        init: function() {
            this.routes.context = this;
            this.ws = new WebSocket('ws://localhost');
            this.ws.onopen = () =>{
                console.log('connection succes with id: ', this.id);
                this.auth();
                this.sitDown();
            }
            this.ws.onmessage = (msg) => {
                const message = JSON.parse(msg.data);
                //console.log('ROUTES: ', message.route)
                if(this.routes[message.route]) this.routes[message.route](message.data);
            }
            this.ws.onclose = function(){
                console.log('Connected closed');
            }
            this.ws.onerror = function(e){
                console.log('Error: ', e);
            }
        }
    };
}

const players = {
    1: createPlayer(1),
    2: createPlayer(2)
    // 3: createPlayer(3),
    // 4: createPlayer(4),
    // 5: createPlayer(5),
    // 6: createPlayer(6)
}


window.onload = () =>{
    for(const id in players){
        players[id].init();
    }
}

function removeChildrenRecursive(element) {
    var children = element.children;
    if (children && children.length > 0) {
      for (var i = 0; i < children.length; i++) {
        removeChildrenRecursive(children[i]);
      }
    }
    element.innerHTML = '';
}