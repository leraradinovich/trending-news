import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  inputText: string = '';

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300;

  @Output() search = new EventEmitter<string>();

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

  performSearch(searchValue: string) {
    this.search.emit(searchValue);
  }
}
