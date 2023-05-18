import { Base } from '../base';

export enum Status {
  TURN = 'turn',
  DRAW = 'draw',
  WON = 'won',
}

export class Connect4 extends Base {
  #columns: number;
  #rows: number;
  #field?: number[][];
  #status = Status.TURN;

  constructor({ columns, rows }: { columns: number; rows: number } = { columns: 7, rows: 6 }) {
    super({ minPlayers: 2, maxPlayers: 2 });
    this.#columns = columns;
    this.#rows = rows;
    this.generateField();
  }

  get status() {
    return {
      status: this.#status,
      currentPlayer: this.currentPlayer,
      field: this.#field,
    };
  }

  generateField() {
    this.#field = getFilledArr(this.#columns).map((_, column) => []);
  }

  drop(column: number) {
    if (!this.#field) {
      throw new Error('Generate a field first');
    }
    if (this.#field[column].length === this.#rows) {
      throw new Error('This column is full');
    }
    this.#field[column].push(this.currentPlayer);
    if (this.#isDraw()) {
      this.#status = Status.DRAW;
    } else if (this.#hasWon()) {
      this.#status = Status.WON;
    } else {
      this.nextPlayer();
    }
    return this.status;
  }

  #isDraw() {
    return this.#field?.every(column => column.length === this.#rows) ?? false;
  }

  #hasWon() {
    return false;
  }
}

const getFilledArr = (count: number, fillWith?: any) => new Array(count).fill(fillWith);
