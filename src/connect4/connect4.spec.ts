import { Connect4, Status } from './';

describe('Connect4', () => {
  test('field is properly generated', () => {
    const game = new Connect4({ columns: 3, rows: 2 });
    expect(game.status.field).toHaveLength(3);
    expect(game.status.field?.[0]).toEqual([]);
  });

  test('drop token in column fills column properly', () => {
    const game = new Connect4();
    game.drop(1);
    game.drop(1);
    game.drop(1);
    game.drop(2);
    expect(game.status.field?.[1]).toEqual([1, 2, 1]);
    expect(game.status.field?.[2]).toEqual([2]);
  });

  test('cannot drop in filled column', () => {
    const game = new Connect4({ columns: 1, rows: 3 });
    game.drop(0);
    game.drop(0);
    game.drop(0);
    expect(() => {
      game.drop(0);
    }).toThrow('This column is full');
  });

  test('game is a draw', () => {
    const game = new Connect4({ columns: 2, rows: 3 });
    const dropAndTurn = (column: number, status = Status.TURN) => {
      game.drop(column);
      expect(game.status.status).toBe(status);
    };
    dropAndTurn(0);
    dropAndTurn(0);
    dropAndTurn(0);
    dropAndTurn(1);
    dropAndTurn(1);
    dropAndTurn(1, Status.DRAW);
  });
});
