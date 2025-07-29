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

  private _vsComputer = signal<boolean>(false);
  readonly vsComputer = this._vsComputer.asReadonly();

  setVsComputerMode(enabled: boolean): void {
    this._vsComputer.set(enabled);
    this.resetGame();
  }

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

    if (this._vsComputer() && !winner && !isDraw && nextPlayer === 'O') {
      setTimeout(() => this.makeComputerMove(), 300);
    }
  }

  private makeComputerMove(): void {
    const current = this._state();
    const bestMove = this.getBestMove(current.board);
    if (bestMove) {
      this.makeMove(bestMove.row, bestMove.col);
    }
  }

  private getBestMove(board: Player[][]): { row: number; col: number } | null {
    let bestScore = -Infinity;
    let move: { row: number; col: number } | null = null;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === null) {
          board[r][c] = 'O';
          const score = this.minimax(board, 0, false);
          board[r][c] = null;
          if (score > bestScore) {
            bestScore = score;
            move = { row: r, col: c };
          }
        }
      }
    }
    return move;
  }

  private minimax(
    board: Player[][],
    depth: number,
    isMaximizing: boolean
  ): number {
    const result = this.checkWinner(board);
    if (result !== null) return this.score(result);

    if (isMaximizing) {
      let best = -Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === null) {
            board[r][c] = 'O';
            best = Math.max(best, this.minimax(board, depth + 1, false));
            board[r][c] = null;
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === null) {
            board[r][c] = 'X';
            best = Math.min(best, this.minimax(board, depth + 1, true));
            board[r][c] = null;
          }
        }
      }
      return best;
    }
  }

  private score(result: Player | 'draw'): number {
    if (result === 'O') return 1;
    if (result === 'X') return -1;
    return 0;
  }
  private checkWinner(board: Player[][]): Player | 'draw' | null {
    const winner = this.checkWinnerWithCoords(board)?.player ?? null;
    if (winner) return winner;
    const isDraw = board.flat().every((cell) => cell !== null);
    return isDraw ? 'draw' : null;
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
