import { Memory, States } from './';

let game: Memory;

describe('Memory', () => {
  test('proper initial setup', () => {
    game = new Memory();
    expect(game.state.field.length).toBe(16);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(item => {
      expect(game.state.field.reduce((prev, curr) => (prev += curr === item ? 1 : 0), 0)).toBe(2);
    });
  });

  test.each([
    [0, 0],
    [8, undefined],
    [undefined, 2],
    [7, 2],
    [16, 3],
  ])('wrong setup throws error', (size: any, pairCount: any) => {
    expect(() => {
      new Memory({ size, pairCount });
    }).toThrow();
  });

  test('registering matches', () => {
    game = new Memory({ size: 8, pairCount: 2 });
    game.field = [0, 1, 2, 3, 0, 1, 2, 3];
    check(0, [0]);
    check(1);
    check(0, [0]);
    check(4, [], [0, 4]);
  });

  test('finishing a game', () => {
    game = new Memory({ size: 6, pairCount: 2 });
    game.field = [0, 1, 2, 0, 1, 2];
    check(0, [0]);
    check(3, [], [0, 3]);
    check(1, [1], [0, 3]);
    check(4, [], [0, 3, 1, 4]);
    check(2, [2], [0, 3, 1, 4]);
    check(5, [], [0, 3, 1, 4, 2, 5], States.DONE);
  });

  test('turning an already turned field throws error', () => {
    game = new Memory({ size: 4, pairCount: 2 });
    game.field = [0, 1, 0, 1];
    game.turn(0);
    // in checked
    expect(() => {
      game.turn(0);
    }).toThrow('This field is currently turned');
    game.turn(2);
    // in turned
    expect(() => {
      game.turn(2);
    }).toThrow('This field is currently turned');
  });

  test;
});

function check(field: number, checked: number[] = [], turned: number[] = [], state = States.TURN) {
  game.turn(field);
  expect(game.state.checked).toEqual(checked);
  expect(game.state.turned).toEqual(turned);
  expect(game.state.state).toBe(state);
}
