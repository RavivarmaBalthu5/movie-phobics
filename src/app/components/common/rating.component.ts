import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circular-rating-container">
      <svg
        class="circular-rating"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        <circle
          class="circle-background"
          cx="60"
          cy="60"
          r="10"
          stroke-width="35"
          fill="#012031"
        />
        <circle
          class="circle-progress"
          cx="60"
          cy="60"
          r="20"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          [attr.stroke]="getBarColor()"
          [attr.stroke-dasharray]="getCircumference()"
          [attr.stroke-dashoffset]="getStrokeDashOffset()"
        />
      </svg>
      <div class="rating-text">{{ getPercentage().toFixed(0) }}%</div>
    </div>
  `
})
export class RatingComponent {
  @Input() rating: number = 0;

  private readonly radius = 20;

  getPercentage(): number {
    return (this.rating / 10) * 100;
  }

  getBarColor(): string {
    const percentage = this.getPercentage();
    if (percentage === 0) return 'grey';
    if (percentage < 30) return 'red';
    if (percentage >= 30 && percentage <= 70) return 'yellow';
    return 'green';
  }

  getCircumference(): number {
    return 2 * Math.PI * this.radius;
  }

  getStrokeDashOffset(): number {
    const circumference = this.getCircumference();
    return circumference - (this.getPercentage() / 100) * circumference;
  }
}

