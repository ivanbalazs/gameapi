import { Base } from '../base';
import Field from './field';

interface ConstructorProps {
  fieldSize: number;
  mineCnt: number;
}

export enum State {
  STEP = 'step',
  WON = 'won',
  FAIL = 'fail',
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export class Minesweeper extends Base {
  #fieldSize: number;
  #mineCnt: number;
  #fields: Field[] = [];
  #state = State.STEP;
  #stepCount = 0;
  #flagCount = 0;

  constructor({ fieldSize, mineCnt }: ConstructorProps) {
    if (isNaN(+fieldSize) || fieldSize < 1) {
      throw new Error('Minesweeper: wrong parameter value given: `fieldSize`');
    }
    if (isNaN(+mineCnt) || mineCnt < 1 || mineCnt >= Math.pow(fieldSize, 2)) {
      throw new Error('Minesweeper: wrong parameter value given: `mineCnt`');
    }
    super();
    this.#fieldSize = fieldSize;
    this.#mineCnt = mineCnt;
    this.generateField();
  }

  get state() {
    return {
      fields: this.#fields,
      state: this.#state,
      stepCount: this.#stepCount,
      flagCount: this.#flagCount,
    };
  }

  set fields(fields: Field[]) {
    if (fields.length !== this.#fieldCount) {
      throw new Error('Cannot set fields: given array does not cover the whole field');
    }
    this.#fields = fields;
  }

  get #fieldCount() {
    return Math.pow(this.#fieldSize, 2);
  }

  get #isComplete() {
    const len = (cond: (f: Field) => boolean) => this.#fields.filter(cond).length;
    return len(f => f.isFlagged) === this.#mineCnt && len(f => f.correctlyFlagged) === this.#mineCnt;
  }

  generateField() {
    const mines = new Set();
    do {
      mines.add(getRandomInt(0, this.#fieldCount));
    } while (mines.size < this.#mineCnt);
    this.fields = new Array(this.#fieldCount).fill(null).map((_, index) => new Field({ index, fieldSize: this.#fieldSize, hasMine: mines.has(index) }));
  }

  toggleFlag(field: Field) {
    field.isFlagged = !field.isFlagged;
    this.#stepCount++;
    this.#flagCount = this.#flagCount + (field.isFlagged ? 1 : -1);
    if (this.#isComplete) {
      this.#state = State.WON;
    }
    return this.state;
  }

  check(field: Field) {
    this.#stepCount++;
    if (field.hasMine) {
      this.#state = State.FAIL;
      this.#revealMines();
    } else if (this.#isComplete) {
      this.#state = State.WON;
    } else {
      this.#revealField(field);
    }
    return this.state;
  }

  #revealField(field: Field) {
    if (field.isRevealed) {
      return;
    }
    const neighbors = field.neighbors;
    field.neighboringMines = neighbors.reduce((cnt, i) => (this.#fields[i].hasMine ? cnt + 1 : cnt), 0);
    field.isRevealed = true;
    field.isFlagged = false;
    if (field.neighboringMines === 0) {
      neighbors.forEach(i => this.#revealField(this.#fields[i]));
    }
  }

  #revealMines() {
    this.#fields.forEach(field => {
      if (field.hasMine) {
        field.isRevealed = true;
      }
    });
  }
}
