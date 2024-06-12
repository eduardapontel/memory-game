const FRONT = 'card-front';
const BACK = 'card-back';
const CARD = 'card';
const ICON = 'icon';

const proxy = new Proxy(game, {
    set: function (target, prop, value) {
        target[prop] = value;
        showMoves();
        return true;
    },
});

startGame();

function startGame() {
    game.createCardsFromTechs();
    initializeCards(game.cards);
}

function initializeCards(cards) {
    let gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let card of cards) {
        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;

        createCardContent(card, cardElement);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    }
}

function createCardContent(card, cardElement) {
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);

    if (face === FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = `./images/${card.icon}.png`;
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = '&lt/&gt';
    }
    element.appendChild(cardElementFace);
}

function flipCard() {
    if (game.setCard(this.id)) {
        this.classList.add('flip');
        if (game.secondCard) {
            proxy.moves++;
            if (game.checkMatch()) {
                game.clearCards();
                if (game.checkGameOver()) {
                    let gameOverLayer = document.getElementById('gameOver');
                    gameOverLayer.style.display = 'flex';
                    getRanking();
                }
            } else {
                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id);
                    let secondCardView = document.getElementById(game.secondCard.id);

                    firstCardView.classList.remove('flip');
                    secondCardView.classList.remove('flip');
                    game.unflipCards();
                }, 1000);
            }
        }
    }
}

function showMoves() {
    let moves = document.getElementById('moves');
    moves.innerHTML = game.moves;
}

function getRanking() {
    game.calculateRanking();
    for (let i = 1; i < 4; i++) {
        let rankingMoves = localStorage.getItem(`place${i}`);
        rankingMoves != 'undefined' ? (rankingMoves += ' moves') : (rankingMoves = '-');
        document.getElementById(`place${i}`).innerHTML = `${rankingMoves}`;
    }
}

function restart() {
    proxy.moves = 0;
    startGame();
    let gameOverLayer = document.getElementById('gameOver');
    gameOverLayer.style.display = 'none';
}
