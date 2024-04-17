import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, combineLatestAll, map, mergeAll, mergeMap, raceWith, tap } from 'rxjs/operators';
import { News, CachedNews } from '../../interfaces/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  isNewsLoading = true;
  // Store news per page
  dataCache: CachedNews = {};
  private baseUrl = 'https://hacker-news.firebaseio.com/v0/';

  constructor(private http: HttpClient) {}

  fetchTrendingNewsIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}topstories.json`).pipe(
      map((responses: any[]) => responses.map((response) => response as number)),
      catchError((error) => {
        console.error('Error fetching news ids:', error);
        return of([]);
      }),
    );
  }

  fetchNews(newsIds: number[], page: number): Observable<News[]> {
    // Check if these news were retrieved before
    if (this.dataCache[page]) {
      return of(this.dataCache[page]);
    } else {
      this.isNewsLoading = true;
      const requests = newsIds.map((id) =>
        this.http.get(`${this.baseUrl}item/${id}.json`).pipe(
          catchError((error) => {
            console.error('Error fetching news item:', error);
            return of(undefined);
          }),
        ),
      );

      return forkJoin(requests).pipe(
        map((responses: any[]) => responses.map((response) => response as News)),
        tap((news: News[]) => {
          this.isNewsLoading = false;

          // Cache the fetched data
          this.dataCache[page] = news;
        }),
        catchError((error) => {
          console.error('Error fetching news items:', error);
          this.isNewsLoading = false;
          return of([]);
        }),
      );
    }
  }

  searchByTitle(query: string, itemsPerPage: number): CachedNews {
    const result: CachedNews = {};
    let currentPage = 1;
    let remainingItems = itemsPerPage;

    Object.keys(this.dataCache).forEach((page) => {
      this.dataCache[page].forEach((item: News) => {
        if (remainingItems === 0) {
          currentPage++;
          remainingItems = itemsPerPage;
        }
        if (!result[currentPage]) {
          result[currentPage] = [];
        }
        if (item.title.toLowerCase().includes(query.toLowerCase())) {
          result[currentPage].push(item);
          remainingItems--;
        }
      });
    });

    return result;
  }
}
