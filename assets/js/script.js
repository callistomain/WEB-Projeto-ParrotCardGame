// Init =====================================================================
const main = document.querySelector("main");
const stopwatch = document.querySelector(".stopwatch");
const delay = 100; // milliseconds (ms)
let time, found, plays, size, interval;
let deck = [1,2,3,4,5,6,7];
startGame();

// Logic ====================================================================
function startGame() {
    main.replaceChildren();
    let start = true;
    let placement = [];

    // Reset statistics
    [time, found, plays] = [0, 0, 0];
    interval = setInterval(updateWatch, delay);
    
    // REFACTOR ??
    // Prompt (game match size)
    while (start) {
        size = +prompt("Escolha a quantidade de cartas da partida (de 4 a 14, apenas números pares).");
        if (isNaN(size)) alert("Não permitido. Tente digitar apenas números pares, de 4 a 14");
        else if (size < 4 || size > 14 || size % 2 != 0) alert("Não permitido. Tente digitar apenas números pares, de 4 a 14");
        else start = false;
    } size /= 2;
    
    // Shuffle (deck and placements)
    deck.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size; i++) placement.push(deck[i], deck[i]);
    placement.sort(() => Math.random() - 0.5);

    // Populate DOM
    placement.forEach(e => main.appendChild(createCard(e)));
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
let cards, wait = false;
function selectCard() {
    if (wait) return;
    this.classList.add("selected");
    
    cards = document.querySelectorAll(".selected:not(.found)");
    if (cards.length == 2) {
        const cardsEqual = (cards[0].id === cards[1].id);
        if (cardsEqual) resolveGame();
        else waitToPlay(1);
        plays++;
    }
}

function resolveGame() {
    cards.forEach(e => e.classList.add("found"));
    found++;

    // REFACTOR
    // Game Over
    if (found == size) {
        clearInterval(interval);
        setTimeout(() => {
            let replay;
            alert(`Você ganhou em ${plays} jogadas com um tempo de ${(time/1000).toFixed(1)} segundos!`);
            while (true) {
                replay = prompt("Quer jogar novamente? (\"sim\" ou \"não\")");
                if (replay === "sim") return startGame();
                else if (replay === "não") return;
                else alert("Resposta inválida. Tente apenas com \"sim\" ou \"não\".");
            }
        }, 10);
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
}

function updateWatch() {
    time += delay;
    stopwatch.textContent = (time/1000).toFixed(1) + "s";
}