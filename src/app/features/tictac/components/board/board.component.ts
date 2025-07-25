import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../cell/cell.component';
import { Player } from '@core/models/game-state.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-board',
  imports: [CommonModule, CellComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board!: Player[][];
  @Input() winningCells: { row: number; col: number }[] | null = null;
  @Output() cellClick = new EventEmitter<{ row: number; col: number }>();

  handleClick(row: number, col: number) {
    this.cellClick.emit({ row, col });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
