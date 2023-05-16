interface ClassProps {
  fieldSize: number;
  hasMine?: boolean;
  index: number;
}

export default class Field {
  index: number;
  fieldSize: number;
  hasMine: boolean;
  neighboringMines?: number;
  isFlagged = false;
  isRevealed = false;

  constructor({ fieldSize, hasMine, index }: ClassProps) {
    if (!+fieldSize || fieldSize < 1) {
      throw new Error('Incorrect data given for `fieldSize`');
    }
    if (isNaN(+index) || index >= Math.pow(fieldSize, 2)) {
      throw new Error('Incorrect data given for `index`');
    }
    this.fieldSize = fieldSize;
    this.hasMine = hasMine ?? false;
    this.index = index;
  }

  get row() {
    return Math.floor(this.index / this.fieldSize);
  }

  get col() {
    return this.index % this.fieldSize;
  }

  get neighbors() {
    let ret = [];
    for (let row = Math.max(this.row - 1, 0); row <= Math.min(this.row + 1, this.fieldSize - 1); row++) {
      for (let col = Math.max(this.col - 1, 0); col <= Math.min(this.col + 1, this.fieldSize - 1); col++) {
        if (row !== this.row || col !== this.col) {
          ret.push(row * this.fieldSize + col);
        }
      }
    }
    return ret;
  }

  get correctlyFlagged() {
    return this.hasMine && this.isFlagged;
  }
}
