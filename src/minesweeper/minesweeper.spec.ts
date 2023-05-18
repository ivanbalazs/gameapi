import { Minesweeper, State } from './minesweeper';
import Field from './field';

describe('Minesweeper', () => {
  test('field is properly generated', () => {
    const game = new Minesweeper({ fieldSize: 2, mineCnt: 1 });
    expect(game.state.fields.length).toBe(4);
  });

  test.each([
    [0, 1, 'Minesweeper: wrong parameter value given: `fieldSize`'],
    ['x', 1, 'Minesweeper: wrong parameter value given: `fieldSize`'],
    [2, 0, 'Minesweeper: wrong parameter value given: `mineCnt`'],
    [2, 4, 'Minesweeper: wrong parameter value given: `mineCnt`'],
    [2, 'x', 'Minesweeper: wrong parameter value given: `mineCnt`'],
  ])('wrong init params throw error', (fieldSize: any, mineCnt: any, error) => {
    expect(() => {
      new Minesweeper({ fieldSize, mineCnt });
    }).toThrow(error);
  });

  test('field has correct number of mines', () => {
    const game = new Minesweeper({ fieldSize: 2, mineCnt: 2 });
    expect(game.state.fields.filter(f => f.hasMine).length).toBe(2);
  });

  test('incorrect number of fields generated', () => {
    const game = new Minesweeper({ fieldSize: 2, mineCnt: 2 });
    expect(() => {
      game.fields = new Array(2);
    }).toThrow('Cannot set fields: given array does not cover the whole field');
  });

  test('flagging field', () => {
    const game = generateGame(2, [0, 1]);
    game.toggleFlag(game.state.fields[0]);
    expect(game.state.fields[0].isFlagged).toBeTruthy();
  });

  test('fields are properly revealed with correct neigboring mine counts', () => {
    const game = generateGame(3, [6, 8]);
    expect(game.state.fields[0].isRevealed).toBeFalsy();
    game.check(game.state.fields[0]);
    const expectRevealed = (index: number, neighborCount: number) => {
      expect(game.state.fields[index].neighboringMines).toBe(neighborCount);
      expect(game.state.fields[0].isRevealed).toBeTruthy();
    };
    expectRevealed(0, 0);
    expectRevealed(1, 0);
    expectRevealed(2, 0);
    expectRevealed(3, 1);
    expectRevealed(4, 2);
    expectRevealed(5, 1);
    expect(game.state.fields[6].isRevealed).toBeFalsy();
    expect(game.state.fields[7].isRevealed).toBeFalsy();
    expect(game.state.fields[8].isRevealed).toBeFalsy();
  });

  test('losing the game by activating a mine', () => {
    const game = generateGame(2, [1]);
    const checkField = (index: number, expectState: State) => {
      const { state } = game.check(game.state.fields[index]);
      expect(state).toBe(expectState);
    };
    checkField(0, State.STEP);
    checkField(2, State.STEP);
    checkField(1, State.FAIL);
  });

  test('all mines are revealed on fail', () => {
    const mines = [1, 3, 5];
    const game = generateGame(3, mines);
    game.check(game.state.fields[1]);
    expect(game.state.state).toBe(State.FAIL);
    mines.forEach(index => {
      expect(game.state.fields[index].isRevealed).toBeTruthy();
    });
  });

  test('winning by flagging all mines', () => {
    const game = generateGame(3, [1, 3, 5]);
    const toggleFieldFlag = (index: number, expectState: State) => {
      const { state } = game.toggleFlag(game.state.fields[index]);
      expect(state).toBe(expectState);
    };
    toggleFieldFlag(0, State.STEP);
    toggleFieldFlag(1, State.STEP);
    toggleFieldFlag(3, State.STEP);
    toggleFieldFlag(4, State.STEP);
    toggleFieldFlag(5, State.STEP);
    toggleFieldFlag(0, State.STEP);
    toggleFieldFlag(4, State.WON);
  });

  test('stepCount works properly', () => {
    const game = generateGame(3, [0, 2, 4, 6, 8]);
    expect(game.state.stepCount).toBe(0);
    game.check(game.state.fields[1]);
    game.check(game.state.fields[3]);
    game.check(game.state.fields[5]);
    game.toggleFlag(game.state.fields[4]);
    game.toggleFlag(game.state.fields[4]);
    expect(game.state.stepCount).toBe(5);
  });

  test('flagCount works properly', () => {
    const game = generateGame(2, [0]);
    expect(game.state.flagCount).toBe(0);
    game.toggleFlag(game.state.fields[0]);
    game.toggleFlag(game.state.fields[1]);
    game.toggleFlag(game.state.fields[2]);
    game.toggleFlag(game.state.fields[0]);
    expect(game.state.flagCount).toBe(2);
  });
});

function generateGame(fieldSize: number, mines: number[]) {
  const game = new Minesweeper({ fieldSize, mineCnt: mines.length });
  game.fields = new Array(Math.pow(fieldSize, 2)).fill(null).map((_, index) => new Field({ fieldSize, index, hasMine: mines.includes(index) }));
  return game;
}
