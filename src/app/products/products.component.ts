import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import goodies from '../helpers/goodies';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RatingComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  protected readonly goodies = goodies;
}
