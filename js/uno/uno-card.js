export default class UnoCard {

  #color = null;
  #number = null;
  #special = null;
  #element = null;

  static colors = { RED: 'red', GREEN: 'green', BLUE: 'blue', YELLOW: 'yellow' };
  static numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  static specials = { REVERSE: 'reverse', SKIP: 'skip', DRAW_TWO: 'draw-two', WILD: 'wild', DRAW_FOUR: 'draw-four' };

  get color() { return this.#color; };
  get number() { return this.#number; };
  get special() { return this.#special; };
  get element() { return this.#element };
  get value() {
    if (this.#number !== null) return UnoCard.numbers.indexOf(this.#number);
    else if (this.#special === UnoCard.specials.WILD || this.#special === UnoCard.specials.DRAW_FOUR) return 50;
    else return 20;
  }

  set color(value) {
    if (value !== null && !Object.values(UnoCard.colors).includes(value)) throw new Error('Invalid color');

    this.#color = value;
  }

  constructor(color, number, special = null) {

    if (color !== null && !Object.values(UnoCard.colors).includes(color)) throw new Error('Invalid color');
    if (number !== null && !UnoCard.numbers.includes(number)) throw new Error('Invalid number');
    if (special !== null && !Object.values(UnoCard.specials).includes(special)) throw new Error('Invalid special');

    this.#color = color;
    this.#number = number;
    this.#special = special;

    this.#element = document.createElement('div');

    this.#element.classList.add('card');

    if (this.#color !== null) this.#element.classList.add(this.#color);
    if (this.#number !== null) this.#element.classList.add(this.#number);
    if (this.#special !== null) this.#element.classList.add(this.#special);
  }

  isPlayableOn(stackCard) {
    if (stackCard.color === this.#color) return true;
    else if (stackCard.number && this.#number && stackCard.number === this.#number) return true;
    else if (this.#special === UnoCard.specials.WILD) return true;
    else if (this.#special === UnoCard.specials.DRAW_FOUR) return true;
    else if (this.#special === UnoCard.specials.DRAW_TWO && stackCard.special === UnoCard.specials.DRAW_TWO) return true;
    else if (this.#special === UnoCard.specials.SKIP && stackCard.special === UnoCard.specials.SKIP) return true;
    else if (this.#special === UnoCard.specials.REVERSE && stackCard.special === UnoCard.specials.REVERSE) return true;
    else return false;
  }

  static getRandomColor() {
    return Object.values(UnoCard.colors)[Math.floor(Math.random() * Object.values(UnoCard.colors).length)];
  }

}
