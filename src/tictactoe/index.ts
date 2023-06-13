import { Base } from '../base';

export enum GameState {
  TURN = 'turn',
  OVER = 'over',
  WON = 'won',
}

export class TicTacToe extends Base {
  #gameState = GameState.TURN;
  #field: (number | null)[] = new Array(9).fill(null);

  constructor() {
    super({ minPlayers: 2, maxPlayers: 2 });
  }

  get state() {
    return {
      state: this.#gameState,
      player: this.currentPlayer,
      field: this.#field,
    };
  }

  turn(_place: number) {
    const place = Math.floor(+_place);
    if (isNaN(place) || place < 0 || place > 8) {
      throw new Error(`Wrong place: ${_place}`);
    }
    if (this.#field[place] !== null) {
      throw new Error('Place already taken');
    }
    if (this.#gameState !== GameState.TURN) {
      throw new Error('Cannot turn, match is over');
    }
    this.#field[place] = this.currentPlayer;
    const won = this.#hasWinner();
    const ended = !this.#hasTurnLeft();
    this.#gameState = won ? GameState.WON : ended ? GameState.OVER : GameState.TURN;
    if (!won && !ended) {
      this.nextPlayer();
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
}
