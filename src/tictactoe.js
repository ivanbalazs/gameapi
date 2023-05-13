export class TicTacToe {
  #gameState = 'TURN';
  #currentPlayer = 0;
  #field = new Array(9).fill(null);

  get state() {
    return {
      state: this.#gameState,
      player: this.#currentPlayer,
      field: this.#field,
    };
  }

  turn(_place) {
    const place = parseInt(_place);
    if (isNaN(place) || place < 0 || place > 8) {
      throw new Error(`Wrong place: ${_place}`);
    }
    if (this.#field[place] !== null) {
      throw new Error('Place already used');
    }
    if (this.#gameState !== 'TURN') {
      throw new Error('Cannot turn, match is over');
    }
    this.#field[place] = this.#currentPlayer;
    const won = this.#hasWinner();
    const ended = !this.#hasTurnLeft();
    this.#gameState = won ? 'WON' : ended ? 'OVER' : 'TURN';
    if (!won && !ended) {
      this.#switchPlayer();
    }
    return this.state;
  }

  #hasTurnLeft() {
    return this.#field.some(cell => cell === null);
  }

  #hasWinner() {
    const winConfig = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winConfig.some(
      ([a, b, c]) =>
        this.#field[a] !== null && this.#field[b] !== null && this.#field[c] !== null && this.#field[a] === this.#field[b] && this.#field[b] === this.#field[c]
    );
  }

  #switchPlayer() {
    this.#currentPlayer = this.#currentPlayer === 0 ? 1 : 0;
  }
}
