interface BaseProps {
  minPlayers: number;
  maxPlayers: number;
}

export abstract class Base {
  minPlayers = 1;
  maxPlayers = 1;
  currentPlayer = 1;

  constructor({ minPlayers, maxPlayers }: BaseProps) {
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
  }

  get props() {
    return {
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
    };
  }

  nextPlayer() {
    this.currentPlayer = this.currentPlayer === this.maxPlayers ? 1 : this.currentPlayer + 1;
  }

  selectPlayer(player: number) {
    if (player < this.minPlayers || player > this.maxPlayers) {
      throw new Error('selectPlayer: wrong player number given');
    }
    this.currentPlayer = player;
  }
}
