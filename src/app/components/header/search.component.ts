import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        placeholder="Search Movie..."
        [value]="searchQuery"
        (input)="onSearchChange($event)"
        class="search-input"
      />
      <fa-icon
        [icon]="faTimes"
        size="lg"
        (click)="handleClear()"
        class="clear-icon"
      />
    </div>
  `
})
export class SearchComponent {
  @Input() searchQuery: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() toggleSearch = new EventEmitter<void>();

  faTimes = faTimes;

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchQueryChange.emit(this.searchQuery);
  }

  handleClear(): void {
    this.searchQuery = '';
    this.searchQueryChange.emit('');
    this.toggleSearch.emit();
  }
}

