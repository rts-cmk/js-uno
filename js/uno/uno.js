import UnoCard from './uno-card.js';
import UnoDeck from "./uno-deck.js";

let deck = UnoDeck.create();

let stack = new UnoDeck(deck.draw());

let hand = new UnoDeck(deck.draw(7));
let cpuHand = new UnoDeck(deck.draw(7));

let handElement = document.querySelector(".hand");

let totalPlayers = 2;

let currentPlayer = 1;

let skipNextTurn = false;

handElement.setAttribute("data-size", hand.size);

document.body.appendChild(stack.topCard.element);
document.body.style.backgroundColor = stack.topCard.color;

checkPlayableCards();

function cardClickHandler(event) {
    let card = hand.cards.find(card => card.element === event.target);

    if (currentPlayer === 1 && card.isPlayableOn(stack.topCard)) {
        stack.add(card);


        if (card.special === UnoCard.specials.DRAW_FOUR || card.special === UnoCard.specials.WILD) {
            let rect = event.currentTarget.getBoundingClientRect();
            let left = event.clientX - rect.left < rect.width / 2;
            let top = event.clientY - rect.top < rect.height / 2;;

            if (left && top) card.color = UnoCard.colors.RED;
            else if (!left && top) card.color = UnoCard.colors.BLUE;
            else if (left && !top) card.color = UnoCard.colors.YELLOW;
            else if (!left && !top) card.color = UnoCard.colors.GREEN;
        }

        document.body.appendChild(event.target);
        hand.remove(event.target);
        handElement.setAttribute("data-size", hand.size);
        event.target.style.transform = `rotate(${(Math.random() - 0.5) * 90}deg)`;

        document.body.style.backgroundColor = card.color;

        switch (card.special) {
            case UnoCard.specials.DRAW_FOUR:
                cpuHand.add(deck.draw(2));
            case UnoCard.specials.DRAW_TWO:
                cpuHand.add(deck.draw(2));
            case UnoCard.specials.SKIP:
            case UnoCard.specials.REVERSE:
                skipNextTurn = true;
        }

        nextPlayer();
        checkPlayableCards();

    }
}

function checkPlayableCards() {
    let playableCards = 0;

    hand.sort();

    hand.forEach(card => {
        handElement.appendChild(card.element);
        card.element.addEventListener('click', cardClickHandler);
        handElement.setAttribute("data-size", hand.size);

        if (currentPlayer === 1 && card.isPlayableOn(stack.topCard)) {
            card.element.classList.add("playable");
            playableCards++;
        } else {
            card.element.classList.remove("playable");
        }
    });

    return playableCards > 0 ? playableCards : false;
}

function nextPlayer() {
    currentPlayer = currentPlayer === totalPlayers ? 1 : currentPlayer + 1;

    if (skipNextTurn) {
        skipNextTurn = false;
        nextPlayer();
    } else {
        switch (currentPlayer) {
            case 1:
                if (!checkPlayableCards()) {
                    let card = deck.draw();
                    hand.add(card);
                    handElement.appendChild(card.element);
                    handElement.setAttribute("data-size", hand.size);
                    card.element.addEventListener('click', cardClickHandler);
                    nextPlayer();
                }
                break;
            case 2:
                setTimeout(takeCPUTurn, 1000);
        }
    }
}

function takeCPUTurn() {
    let playableCards = cpuHand.playableCards(stack.topCard);
    let delay = 0;

    if (playableCards.length > 0) {

        let card = playableCards[Math.floor(Math.random() * playableCards.length)];

        card.element.classList.add("off-top");

        setTimeout(() => card.element.classList.remove("off-top"), 1);
        delay = 1000;

        if (card.special === UnoCard.specials.DRAW_FOUR || card.special === UnoCard.specials.WILD) {
            card.color = UnoCard.getRandomColor();
        }

        cpuHand.remove(card);
        stack.add(card);
        document.body.appendChild(card.element);
        card.element.style.transform = `rotate(${(Math.random() - 0.5) * 90}deg)`;

        switch (card.special) {
            case UnoCard.specials.DRAW_FOUR:
                hand.add(deck.draw(2));
            case UnoCard.specials.DRAW_TWO:
                hand.add(deck.draw(2));
            case UnoCard.specials.SKIP:
            case UnoCard.specials.REVERSE:
                skipNextTurn = true;
        }

        checkPlayableCards();

        document.body.style.backgroundColor = card.color;

        
        console.log("CPU cards: ", [...cpuHand.cards]);

        if (cpuHand.size === 0) {
            alert("CPU wins!");
            return;
        }
    } else {
        cpuHand.add(deck.draw());
    }
    setTimeout(nextPlayer, delay);
}
