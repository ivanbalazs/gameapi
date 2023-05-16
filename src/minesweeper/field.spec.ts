import Field from './field';

describe('Minesweeper Field', () => {
  test.each([
    [1, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 1, 0, 1],
    [2, 2, 1, 0],
    [2, 3, 1, 1],
  ])('test proper field row&col', (fieldSize: number, index: number, row: number, col: number) => {
    const field = new Field({ fieldSize, index });
    expect(field.row).toBe(row);
    expect(field.col).toBe(col);
  });

  test.each([[0], [-2], ['a']])('bad data for fieldSize throws error', (fieldSize: any) => {
    expect(() => new Field({ fieldSize, index: 0 })).toThrow('Incorrect data given for `fieldSize`');
  });

  test.each([
    [1, 1],
    [2, 4],
    [2, 40],
    [2, 'a'],
  ])('bad data for index throws error', (fieldSize: number, index: any) => {
    expect(() => new Field({ fieldSize, index })).toThrow('Incorrect data given for `index`');
  });

  test.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true],
  ])('is correctly flagged', (hasMine: boolean, isFlagged: boolean, correctlyFlagged: boolean) => {
    const field = new Field({ fieldSize: 1, index: 0, hasMine });
    field.isFlagged = isFlagged;
    expect(field.correctlyFlagged).toBe(correctlyFlagged);
  });
});
