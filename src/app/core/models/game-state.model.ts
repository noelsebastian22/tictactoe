export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[][];
  currentPlayer: 'X' | 'O';
  winner: Player;
  winningCells: { row: number; col: number }[] | null;
  lastMove: { row: number; col: number } | null;
  isDraw: boolean;
}
