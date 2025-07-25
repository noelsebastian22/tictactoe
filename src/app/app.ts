import { Component } from '@angular/core';
import { TicTacContainerComponent } from './features/tictac/tictac-container/tictac-container.component';

@Component({
  selector: 'app-root',
  template: '<app-tictac />',
  imports: [TicTacContainerComponent],
  styleUrl: './app.scss'
})
export class App {
  protected title = 'new-proj';
}
