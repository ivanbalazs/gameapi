import { Base } from '../base';

export enum Status {
  TURN = 'turn',
  DRAW = 'draw',
  WIN = 'win',
}

interface checkLineProps {
  start: number;
  inverted?: boolean;
  fixed?: boolean;
}

const CONNECT = 4;

export class Connect4 extends Base {
  #columns: number;
  #rows: number;
  #field?: number[][];
  #status = Status.TURN;
  #current = { row: 0, col: 0 };

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
    this.#field = getFilledArr(this.#columns).map(() => []);
  }

  drop(column: number) {
    if (!this.#field) {
      throw new Error('Generate a field first');
    }
    if (this.#field[column].length === this.#rows) {
      throw new Error('This column is full');
    }
    const count = this.#field[column].push(this.currentPlayer);
    this.#current = { col: column, row: count - 1 };
    if (this.#isWin()) {
      this.#status = Status.WIN;
    } else if (this.#isDraw()) {
      this.#status = Status.DRAW;
    } else {
      this.nextPlayer();
    }
    return this.status;
  }

  #isDraw() {
    return this.#field?.every(column => column.length === this.#rows) ?? false;
  }

  #isWin() {
    return (
      // vertical
      this.#checkLine({ start: 0, fixed: true }, { start: -3 }) ||
      // horizontal
      this.#checkLine({ start: 0 }, { start: 0, fixed: true }) ||
      this.#checkLine({ start: -1 }, { start: 0, fixed: true }) ||
      this.#checkLine({ start: -2 }, { start: 0, fixed: true }) ||
      this.#checkLine({ start: -3 }, { start: 0, fixed: true }) ||
      // diagonal ascending
      this.#checkLine({ start: 0 }, { start: 0 }) ||
      this.#checkLine({ start: -1 }, { start: -1 }) ||
      this.#checkLine({ start: -2 }, { start: -2 }) ||
      this.#checkLine({ start: -3 }, { start: -3 }) ||
      // diagonal descending
      this.#checkLine({ start: 0 }, { start: 0, inverted: true }) ||
      this.#checkLine({ start: -1 }, { start: 1, inverted: true }) ||
      this.#checkLine({ start: -2 }, { start: 2, inverted: true }) ||
      this.#checkLine({ start: -3 }, { start: 3, inverted: true })
    );
  }

  #checkLine(_col: checkLineProps, _row: checkLineProps): boolean {
    let col = this.#current.col + _col.start;
    let row = this.#current.row + _row.start;
    if (col < 0 || row < 0 || !this.#field) {
      return false;
    }
    let count = 0;
    for (let i = 0; i < CONNECT; i++) {
      if (!this.#field[col]?.[row]) {
        return false;
      }
      count += this.#field[col][row];
      col += _col.fixed ? 0 : _col.inverted ? -1 : 1;
      row += _row.fixed ? 0 : _row.inverted ? -1 : 1;
    }
    return count === this.currentPlayer * CONNECT;
  }
}

const getFilledArr = (count: number, fillWith?: any) => new Array(count).fill(fillWith);
