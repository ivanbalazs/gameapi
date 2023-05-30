import shuffle from 'lodash.shuffle';
import { Base } from '../base';

interface ConstructorParams {
  size: number;
  pairCount?: number;
}

export enum States {
  TURN = 'turn',
  DONE = 'done',
}

export class Memory extends Base {
  #size: number;
  #pairCount: number;
  #field: number[];
  /**
   * Contains the field indices that have been turned recently to check for match
   */
  #checked: number[] = [];
  /**
   * Contains the field indices where pairs have been found
   */
  #turned: number[] = [];
  #state = States.TURN;
  #steps = 0;

  constructor({ pairCount, size }: ConstructorParams = { size: 16, pairCount: 2 }) {
    super();
    if (!pairCount || size % pairCount) {
      throw new Error('Cannot setup field: `size` is not a multiplier of `pairCount`');
    }
    this.#size = size;
    this.#pairCount = pairCount;
    this.#field = shuffle<number>(
      new Array(size / pairCount)
        .fill(null)
        .map((_, i) => new Array(pairCount).fill(i))
        .flat()
    );
  }

  get state() {
    return {
      state: this.#state,
      steps: this.#steps,
      field: this.#field,
      checked: this.#checked,
      turned: this.#turned,
    };
  }

  set field(config: number[]) {
    if (config.length !== this.#size) {
      throw new Error('Given size does not match game field size');
    }
    if (config.find(i => isNaN(+i) || i < 0 || i > this.#size / this.#pairCount - 1)) {
      throw new Error('Given config contains invalid entry');
    }
    this.#field = config;
  }

  turn(fieldIndex: number) {
    if (this.#state === States.DONE) {
      throw new Error('This game is already over');
    }
    if (this.#turned.includes(fieldIndex) || this.#checked.includes(fieldIndex)) {
      throw new Error('This field is currently turned');
    }
    this.#checked.push(fieldIndex);
    this.#steps++;
    if (this.#checked.length === this.#pairCount) {
      if (new Set(this.#checked.map(i => this.#field[i])).size === 1) {
        this.#turned = [...this.#turned, ...this.#checked];
      }
      this.#checked = [];
    }
    if (this.#turned.length === this.#size) {
      this.#state = States.DONE;
    }
    return this.state;
  }
}
