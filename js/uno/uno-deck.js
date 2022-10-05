import UnoCard from "./uno-card.js";

export default class UnoDeck {

    #cards = [];

    get cards() { return this.#cards; };
    get size() { return this.#cards.length; };

    get topCard() { return this.#cards[0]; };

    constructor(cards = null) {
        if (cards !== null) {
            if (cards instanceof UnoCard) this.#cards.push(cards);
            else if (!Array.isArray(cards)) throw new Error('"cards" must be an array');
            else if (cards.length === 0) throw new Error('Invalid cards');
            else if (!cards.every(card => card instanceof UnoCard)) throw new Error('Invalid cards');
            else this.#cards = cards;
        }
    }

    add() {
        if (arguments.length === 1) {
            if (Array.isArray(arguments[0])) {
                this.#cards.unshift(...arguments[0]);
            } else {
                this.#cards.unshift(arguments[0]);
            }
        } else if (arguments.length <= 4) {
            let color = arguments[0];
            let value = arguments[1];
            let special = arguments[2];
            let amount = arguments[3] ?? 1;

            for (let i = 0; i < amount; i++) {
                this.#cards.unshift(new UnoCard(color, value, special));
            }
        } else {
            throw new Error("Invalid amount of arguments");
        }
    }

    remove(card) {
        let index;

        if (card instanceof UnoCard) {
            index = this.#cards.indexOf(card);
        } else if (card instanceof HTMLDivElement) {
            index = this.#cards.findIndex(c => c.element === card);
        } else {
            throw new Error('Invalid card');
        }

        if (index === -1) throw new Error('Card not found');

        return this.#cards.splice(index, 1)[0];
    }


    shuffle() {
        this.#cards.sort(() => Math.random() - 0.5);
    }

    draw(amount = 1) {
        let drawnCards = [];

        for (let i = 0; i < amount; i++) {
            drawnCards.push(this.#cards.shift());
        }

        return amount === 1 ? drawnCards[0] : drawnCards;
    }

    sort() {
        let redCards = this.#cards.filter(card => card.color === UnoCard.colors.RED);
        let greenCards = this.#cards.filter(card => card.color === UnoCard.colors.GREEN);
        let blueCards = this.#cards.filter(card => card.color === UnoCard.colors.BLUE);
        let yellowCards = this.#cards.filter(card => card.color === UnoCard.colors.YELLOW);
        let otherCards = this.#cards.filter(card => card.color === null);


        [redCards, greenCards, blueCards, yellowCards, otherCards].forEach(cards => {
            cards = cards.sort((a, b) => a.value - b.value);
        });

        this.#cards = [...redCards, ...greenCards, ...blueCards, ...yellowCards, ...otherCards];
    }

    playableCards(currentCard) {
        return this.#cards.filter(card => card.isPlayableOn(currentCard));
    }

    forEach(callback) {
        this.#cards.forEach(callback);
    }

    static create(shuffled = true) {
        let deck = new UnoDeck();

        Object.values(UnoCard.colors).forEach(color => {
            UnoCard.numbers.forEach(number => {
                deck.add(color, number);

                if (number !== 0) deck.add(color, number);
            })

            deck.add(color, null, UnoCard.specials.REVERSE, 2);
            deck.add(color, null, UnoCard.specials.SKIP, 2);
            deck.add(color, null, UnoCard.specials.DRAW_TWO, 2);
        });

        deck.add(null, null, UnoCard.specials.WILD, 4);
        deck.add(null, null, UnoCard.specials.DRAW_FOUR, 4);

        if (shuffled) deck.shuffle();

        return deck;
    }

}