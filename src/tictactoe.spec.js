import { TicTacToe } from './tictactoe';

let game;

describe('TicTacToe', () => {
  beforeEach(() => {
    game = new TicTacToe();
  });

  test('initial setup of playfield', () => {
    expect(game.state.state).toBe('TURN');
    expect(game.state.player).toBe(0);
  });

  test('bad place throws error', () => {
    expect(() => {
      game.turn('a');
    }).toThrow('Wrong place: a');
  });

  test('cannot place in already used cell', () => {
    game.turn(0);
    expect(() => {
      game.turn(0);
    }).toThrow('Place already used');
  });

  test('take turn', () => {
    game.turn(0);
    expect(game.state.player).toBe(1);
  });

  test('take 2 turns', () => {
    game.turn(0);
    game.turn(1);
    expect(game.state.player).toBe(0);
  });

  test('player 1 wins', () => {
    game.turn(0);
    game.turn(3);
    game.turn(1);
    game.turn(4);
    game.turn(2);
    expect(game.state.state).toBe('WON');
    expect(game.state.player).toBe(0);
  });

  test('player 2 wins', () => {
    game.turn(0);
    game.turn(3);
    game.turn(1);
    game.turn(4);
    game.turn(8);
    game.turn(5);
    expect(game.state.state).toBe('WON');
    expect(game.state.player).toBe(1);
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
    expect(game.state.state).toBe('OVER');
    expect(game.state.player).toBe(0);
  });
});
