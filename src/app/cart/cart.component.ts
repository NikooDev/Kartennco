import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgIf,
    RatingComponent,
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public steps = [{
    title: 'Mon compte'
  }, {
    title: 'Expédition'
  }, {
    title: 'Paiement'
  }];

  public currentStep = 0;

  public next() {
    this.currentStep++;
  }

  public prev() {
    this.currentStep--;
  }
}
