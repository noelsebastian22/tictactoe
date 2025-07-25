import { Injectable, signal } from '@angular/core';
import { GameState, Player } from '@core/models/game-state.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly emptyBoard: Player[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  private _state = signal<GameState>({
    board: structuredClone(this.emptyBoard),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    winningCells: null,
    lastMove: null,
  });

  readonly state = this._state.asReadonly();

  resetGame(): void {
    this._state.set({
      board: structuredClone(this.emptyBoard),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      winningCells: null,
      lastMove: null,
    });
  }

  makeMove(row: number, col: number): void {
    const current = this._state();

    if (current.board[row][col] || current.winner) return;

    const newBoard = current.board.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === row && cIdx === col ? current.currentPlayer : cell
      )
    );

    const winnerData = this.checkWinnerWithCoords(newBoard);
    const winner = winnerData?.player ?? null;
    const winningCells = winnerData?.cells ?? null;
    const isDraw = !winner && newBoard.flat().every((cell) => cell !== null);
    const nextPlayer = current.currentPlayer === 'X' ? 'O' : 'X';

    this._state.set({
      board: newBoard,
      currentPlayer: winner || isDraw ? current.currentPlayer : nextPlayer,
      winner,
      isDraw,
      lastMove: { row, col },
      winningCells,
    });
  }

  private checkWinnerWithCoords(
    board: Player[][]
  ): { player: Player; cells: { row: number; col: number }[] } | null {
    const lines = [
      // Rows
      [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: 2 },
      ],
      [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 1, c: 2 },
      ],
      [
        { r: 2, c: 0 },
        { r: 2, c: 1 },
        { r: 2, c: 2 },
      ],
      // Columns
      [
        { r: 0, c: 0 },
        { r: 1, c: 0 },
        { r: 2, c: 0 },
      ],
      [
        { r: 0, c: 1 },
        { r: 1, c: 1 },
        { r: 2, c: 1 },
      ],
      [
        { r: 0, c: 2 },
        { r: 1, c: 2 },
        { r: 2, c: 2 },
      ],
      // Diagonals
      [
        { r: 0, c: 0 },
        { r: 1, c: 1 },
        { r: 2, c: 2 },
      ],
      [
        { r: 0, c: 2 },
        { r: 1, c: 1 },
        { r: 2, c: 0 },
      ],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      const val = board[a.r][a.c];
      if (val && val === board[b.r][b.c] && val === board[c.r][c.c]) {
        return {
          player: val,
          cells: line.map((p) => ({ row: p.r, col: p.c })),
        };
      }
    }
    return null;
  }
}
