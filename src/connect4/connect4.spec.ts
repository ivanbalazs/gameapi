import { Connect4, Status } from './';

let game;

describe('Connect4', () => {
  beforeEach(() => {
    game = new Connect4();
  });

  test('field is properly generated', () => {
    game = new Connect4({ columns: 3, rows: 2 });
    expect(game.status.field).toHaveLength(3);
    expect(game.status.field?.[0]).toEqual([]);
  });

  test('drop token in column fills column and players are turned properly', () => {
    expect(game.status.currentPlayer).toBe(1);
    game.drop(1);
    expect(game.status.currentPlayer).toBe(2);
    game.drop(1);
    expect(game.status.currentPlayer).toBe(1);
    game.drop(1);
    expect(game.status.currentPlayer).toBe(2);
    game.drop(2);
    expect(game.status.field?.[1]).toEqual([1, 2, 1]);
    expect(game.status.field?.[2]).toEqual([2]);
  });

  test('cannot drop in filled column', () => {
    game = new Connect4({ columns: 1, rows: 3 });
    game.drop(0);
    game.drop(0);
    game.drop(0);
    expect(() => {
      game.drop(0);
    }).toThrow('This column is full');
  });

  test('game is a draw', () => {
    game = new Connect4({ columns: 2, rows: 3 });
    dropAndTurn(0);
    dropAndTurn(0);
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(1);
    dropAndTurn(1, Status.DRAW);
  });

  test('win by connecting a column', () => {
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(2);
    dropAndTurn(1, Status.WIN);
  });

  test('win by connecting a row', () => {
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(2);
    dropAndTurn(3);
    dropAndTurn(4);
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(5);
    dropAndTurn(2);
    dropAndTurn(5);
    dropAndTurn(4);
    dropAndTurn(5);
    dropAndTurn(3, Status.WIN);
  });

  test('win by an ascending diagonal', () => {
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(2);
    dropAndTurn(3);
    dropAndTurn(4);
    dropAndTurn(5);
    dropAndTurn(1);
    dropAndTurn(3);
    dropAndTurn(2);
    dropAndTurn(3);
    dropAndTurn(3);
    dropAndTurn(4);
    dropAndTurn(2, Status.WIN);
  });

  test('win by a descending diagonal', () => {
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(2);
    dropAndTurn(3);
    dropAndTurn(4);
    dropAndTurn(5);
    dropAndTurn(3);
    dropAndTurn(2);
    dropAndTurn(1);
    dropAndTurn(1);
    dropAndTurn(1);
    dropAndTurn(6);
    dropAndTurn(2, Status.WIN);
  });
});

function dropAndTurn(column: number, status = Status.TURN) {
  game.drop(column);
  expect(game.status.status).toBe(status);
}
