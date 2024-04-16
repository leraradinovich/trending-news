import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news/news.service';
import { CachedNews, News } from '../../interfaces/news';

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
  pageFilteredPosition = 1;
  isSearchValue: boolean = false;
  filteredNews: CachedNews = {};
  filteredNewsCount: number = 0;

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
    this.pageFilteredPosition = event;

    if (this.isSearchValue) {
      this.newsArr = this.filteredNews[this.pageFilteredPosition] as News[];
    } else {
      this.getNewsArray();
    }
  }

  scrollToEl(): void {
    this.newsEl.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  onSearch(event: string): void {
    this.isSearchValue = !!event?.length;

    if (this.isSearchValue) {
      this.pageFilteredPosition = 1;
      this.filteredNews = this.newsService.searchByTitle(event, this.itemsPerPage);
      this.newsArr = this.filteredNews[this.pageFilteredPosition] as News[];
      this.getTotalFilteredNewsCount();
    } else {
      this.filteredNews = {};
      this.newsArr = this.newsService.dataCache[this.pagePosition];
    }
  }

  getTotalFilteredNewsCount(): void {
    this.filteredNewsCount = 0;

    Object.keys(this.filteredNews).forEach((page) => {
      this.filteredNewsCount += this.filteredNews[page].length;
    });
  }
}
