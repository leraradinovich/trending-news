import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';

@NgModule({
  declarations: [AppComponent, NewsComponent, NewsItemComponent, PaginationComponent, LoadingPlaceholderComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({}))
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
