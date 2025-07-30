import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core';

import { GameService } from '../services/game.service';

import { BoardComponent } from '../components/board/board.component';
import { GameState } from '@core/models/game-state.model';

import confetti from 'canvas-confetti';

@Component({
  standalone: true,
  selector: 'app-tictac',
  imports: [CommonModule, BoardComponent],
  templateUrl: './tictac-container.component.html',
  styleUrls: ['./tictac-container.component.scss'],
})
export class TicTacContainerComponent {
  state: Signal<GameState>;
  theme: WritableSignal<'light' | 'dark'> = signal<'light' | 'dark'>('light');

  constructor(private gameService: GameService) {
    this.state = this.gameService.state;

    effect(() => {
      const winner = this.state().winner;
      if (winner) {
        this.launchConfetti();
      }
    });
  }

  onCellClick(row: number, col: number) {
    this.gameService.makeMove(row, col);
  }

  reset() {
    this.gameService.resetGame();
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    document.body.className = newTheme; // update global class
  }

  toggleComputerMode() {
    const newMode = !this.gameService.vsComputer();
    this.gameService.setVsComputerMode(newMode);
  }

  isVsComputer(): boolean {
    return this.gameService.vsComputer();
  }

  onDifficultyChange(event: Event) {
    const selectedLevel = (event.target as HTMLInputElement).value as
      | 'easy'
      | 'hard';
    this.gameService.setDifficulty(selectedLevel);
  }

  launchConfetti(): void {
    const duration = 1 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  }
}
