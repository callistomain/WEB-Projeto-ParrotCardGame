// Init =====================================================================
const main = document.querySelector("main");
const stopwatch = document.querySelector(".stopwatch");
const delay = 100; // milliseconds (ms)
const deck = [1,2,3,4,5,6,7];
let time, pairs, plays, size, interval;
startGame();

// Logic ====================================================================
function startGame() {
    // Reset statistics
    [time, pairs, plays] = [0, 0, 0];
    interval = setInterval(updateWatch, delay);
    
    // Prompt (game match size)
    while (true) {
        size = +prompt("Escolha a quantidade de cartas da partida (de 4 a 14, apenas números pares).");
        if (size < 4 || size > 14 || size % 2 != 0) alert("Não permitido. Tente digitar apenas números pares, de 4 a 14");
        else break;
    } size /= 2;
    
    // Shuffle (deck and placements)
    const placement = [];
    deck.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size; i++) placement.push(deck[i], deck[i]);
    placement.sort(() => Math.random() - 0.5);

    // Populate DOM
    const fragment = document.createDocumentFragment();
    placement.forEach(e => fragment.appendChild(createCard(e)));
    main.replaceChildren(fragment);
}

// DOM
function createCard(i) {
    const card = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    let img;

    front.classList.add("front", "face");
    img = document.createElement("img");
    img.src = "./assets/images/front.png";
    front.appendChild(img);
    
    back.classList.add("back", "face");
    img = document.createElement("img");
    img.src = `./assets/images/back${i}.gif`;
    back.appendChild(img);
    
    card.classList.add("card");
    card.id = i.toString();
    card.addEventListener("click", selectCard);
    card.appendChild(front);
    card.appendChild(back);
    return card;
}

// Game Logic ===============================================================
let cards = [];
let wait = false;

function selectCard() {
    if (wait) return;
    if (this.classList.contains("selected")) return;

    this.classList.add("selected");
    cards.push(this);
    
    if (cards.length == 2) resolvePlay();
}

function resolvePlay() {
    const pairEqual = (cards[0].id === cards[1].id);
    plays++;

    if (pairEqual) {
        pairs++;
        cards.length = 0;
        if (pairs == size) setTimeout(gameOver, 10);
    } else {
        waitToPlay(1);
    }
}

function gameOver() {
    let replay;
    clearInterval(interval);
    alert(`Você ganhou em ${plays} jogadas com um tempo de ${(time/1000).toFixed(1)} segundos!`);

    while (true) {
        replay = prompt("Quer jogar novamente? (\"sim\" ou \"não\")");
        if (replay === "sim") return startGame();
        else if (replay === "não") return;
        else alert("Resposta inválida. Tente apenas com \"sim\" ou \"não\".");
    }
}

// Helpers ==================================================================
function waitToPlay(time) {
    wait = true;
    setTimeout(stopWait, time*1000);
}

function stopWait() {
    wait = false;
    cards.forEach(e => e.classList.remove("selected"));
    cards.length = 0;
}

function updateWatch() {
    time += delay;
    stopwatch.textContent = (time/1000).toFixed(1) + "s";
}