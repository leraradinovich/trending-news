import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news/news.service';
import { News } from '../../interfaces/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  title = 'Trending News';
  newsIds: number[] = [];
  newsArr: News[] = [];
  itemsPerPage = 10;
  pagePosition = 1;

  @ViewChild('newsEl', { static: true }) newsEl!: ElementRef;

  constructor(public newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.fetchTrendingNewsIds().subscribe((newsIds: number[]) => {
      this.newsIds = newsIds;
      this.getNewsArray();
    });
  }

  getNewsArray(): any {
    const newsIds = this.newsIds.slice(
      (this.pagePosition - 1) * this.itemsPerPage,
      this.itemsPerPage * this.pagePosition,
    );

    this.newsService.fetchNews(newsIds, this.pagePosition).subscribe((news: News[]) => {
      this.newsArr = news;
    });
  }

  onPageChange(event: number) {
    this.newsArr = [];
    this.scrollToEl();
    this.pagePosition = event;
    this.getNewsArray();
  }

  scrollToEl(): void {
    this.newsEl.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
