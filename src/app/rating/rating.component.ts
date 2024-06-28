import { Component, Input, OnChanges } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnChanges {
  @Input() rating!: number;
  stars: boolean[] = Array(5).fill(false);

  ngOnChanges(): void {
    this.updateStars();
  }

  updateStars(): void {
    const roundedRating = Math.round(this.rating);
    this.stars = this.stars.map((_, index) => index < roundedRating);
  }

  rate(rating: number): void {
    this.rating = rating;
    this.updateStars();
  }
}
