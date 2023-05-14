export enum GameState {
  turn = 'TURN',
  over = 'OVER',
  won = 'WON',
}

export type Players = 1 | 2;

export type FieldPlaces = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export class TicTacToe {
  #gameState = GameState.turn;
  #currentPlayer: Players = 1;
  #field: (FieldPlaces | null)[] = new Array(9).fill(null);

  get state() {
    return {
      state: this.#gameState,
      player: this.#currentPlayer,
      field: this.#field,
    };
  }

  turn(_place: FieldPlaces) {
    const place = Math.floor(_place);
    if (isNaN(place) || place < 0 || place > 8) {
      throw new Error(`Wrong place: ${_place}`);
    }
    if (this.#field[place] !== null) {
      throw new Error('Place already taken');
    }
    if (this.#gameState !== GameState.turn) {
      throw new Error('Cannot turn, match is over');
    }
    this.#field[place] = this.#currentPlayer;
    const won = this.#hasWinner();
    const ended = !this.#hasTurnLeft();
    this.#gameState = won ? GameState.won : ended ? GameState.over : GameState.turn;
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
    return winConfig.some(([a, b, c]) => {
      const f = this.#field;
      return f[a] && f[b] && f[c] && f[a] === f[b] && f[b] === f[c];
    });
  }

  #switchPlayer() {
    this.#currentPlayer = this.#currentPlayer === 1 ? 2 : 1;
  }
}
