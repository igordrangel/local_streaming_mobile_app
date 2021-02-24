import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const DEFAULT_IMAGE = './assets/poster-default.jpg';

@Injectable({providedIn: 'root'})
export class ImdbService {

  constructor(private http: HttpClient) {}

  public getPoster(name: string) {
    return new Observable<string>(observe => {
      this.http
          .get('https://imdb-api.com/en/API/Search/k_fwc4vynb/' + name)
          .subscribe((response: any) => {
            observe.next(response?.results ? (response?.results[0]?.image ?? DEFAULT_IMAGE) : DEFAULT_IMAGE);
          }, error => observe.error(error));
    });
  }

  public getBanner(name: string) {
    return new Observable<string>(observe => {
      this.http
          .get('https://imdb-api.com/en/API/Search/k_fwc4vynb/' + name)
          .subscribe((response: any) => {
            observe.next(response?.results ? (response?.results[0]?.image ?? DEFAULT_IMAGE) : DEFAULT_IMAGE);
          }, error => observe.error(error));
    });
  }
}
