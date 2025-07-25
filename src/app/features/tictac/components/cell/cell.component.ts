import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '@core/models/game-state.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  animations: [
    trigger('winnerPulse', [
      transition(':enter', []), // no enter animation needed
      transition('* => *', [
        animate(
          '600ms ease-in-out',
          style({ transform: 'scale(1.2)', backgroundColor: '#ffe58f' })
        ),
        animate(
          '300ms ease-out',
          style({ transform: 'scale(1)', backgroundColor: 'transparent' })
        ),
      ]),
    ]),
  ],
})
export class CellComponent {
  @Input() row!: number;
  @Input() col!: number;
  @Input() winningCells: { row: number; col: number }[] | null = null;
  @Input() value!: Player;

  get isWinningCell(): boolean {
    return (
      this.winningCells?.some(
        (p) => p.row === this.row && p.col === this.col
      ) ?? false
    );
  }

  // @HostBinding('@winnerPulse')
  // get animateWinner(): boolean {
  //   return this.isWinningCell;
  // }
}
