import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @Input()
  header: string;

  @Input()
  total: string;

  @Input()
  icons: string;

  get totalAmount() {
    return +this.total;
  }
}
