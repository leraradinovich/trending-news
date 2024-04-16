import { Component, Input } from '@angular/core';
import { News } from '../../interfaces/news';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.scss',
})
export class NewsItemComponent {
  @Input() news!: News;

  constructor() {}
}
