import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('title', { static: false }) title?: ElementRef;
  @ViewChild('year', { static: false }) year?: ElementRef;

  private unsubscribe$ = new Subject<void>();
  private baseUrl = 'https://www.omdbapi.com/?t=';
  private key = environment.apiKey;
  protected dataArr: any = [];

  urlOMDB = 'https://www.omdbapi.com/';
  layout = 'inline';
  currentMovie = 0;
  lightbox = false;

  constructor(private _http: HttpClient) {}

  // Return all episodes by using just the "Season" parameter:
  // http://www.omdbapi.com/?t=Game of Thrones&Season=1
  queryOne: string = '?t=Game of Thrones&Season=1';

  // Season+Episode search parameters added:
  // http://www.omdbapi.com/?t=Game of Thrones&Season=1&Episode=1
  queryTwo: string = '?t=Game of Thrones&Season=1&Episode=2';

  titleQuery: string = '?t=The Godfather';
  yearQuery?: string;
  // //queryThree:string = '?t=The Godfather&plot=short';
  // //queryThree:string = '?t=The Godfather&y=1974';

  fetchResults() {
    this.titleQuery = this.title!.nativeElement.value;
    this.yearQuery = this.year!.nativeElement.value;

    this._http
      .get(this.baseUrl + this.titleQuery + '&y=' + this.yearQuery + this.key)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.dataArr.unshift(data);
      });

    this.title!.nativeElement.value = '';
    this.year!.nativeElement.value = '';
  }

  previousFlick() {
    this.currentMovie > 0 ? this.currentMovie-- : '';
  }

  nextFlick() {
    this.dataArr.length > this.currentMovie ? this.currentMovie++ : '';
  }

  setLayout(val: string) {
    this.layout = val;
  }

  openLightbox(i: number) {
    this.currentMovie = i;
    this.lightbox = true;
  }

  closeLightbox() {
    this.lightbox = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
