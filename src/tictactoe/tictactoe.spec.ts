import { TicTacToe } from './';

let game: TicTacToe;

describe('TicTacToe', () => {
  beforeEach(() => {
    game = new TicTacToe();
  });

  test('initial setup of playfield', () => {
    expect(game.state.state).toBe('turn');
    expect(game.state.player).toBe(1);
  });

  test('bad place throws error', () => {
    expect(() => {
      game.turn('a' as any);
    }).toThrow('Wrong place: a');
  });

  test('cannot place in already used cell', () => {
    game.turn(0);
    expect(() => {
      game.turn(0);
    }).toThrow('Place already taken');
  });

  test('take turn', () => {
    game.turn(0);
    expect(game.state.player).toBe(2);
  });

  test('take 2 turns', () => {
    game.turn(0);
    game.turn(1);
    expect(game.state.player).toBe(1);
  });

  test('player 1 wins', () => {
    game.turn(0);
    game.turn(3);
    game.turn(1);
    game.turn(4);
    game.turn(2);
    expect(game.state.state).toBe('won');
    expect(game.state.player).toBe(1);
  });

  test('player 2 wins', () => {
    game.turn(0);
    game.turn(3);
    game.turn(1);
    game.turn(4);
    game.turn(8);
    game.turn(5);
    expect(game.state.state).toBe('won');
    expect(game.state.player).toBe(2);
  });

  test('cannot take turn after winning', () => {
    game.turn(0);
    game.turn(3);
    game.turn(1);
    game.turn(4);
    game.turn(2);
    expect(() => {
      game.turn(8);
    }).toThrow('Cannot turn, match is over');
  });

  test('end game with no winner', () => {
    game.turn(0);
    game.turn(1);
    game.turn(2);
    game.turn(3);
    game.turn(4);
    game.turn(6);
    game.turn(7);
    game.turn(8);
    game.turn(5);
    expect(game.state.state).toBe('over');
    expect(game.state.player).toBe(1);
  });
});
