import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImdbService {
  
  constructor(private http: HttpClient) {}
  
  public getPoster(name: string) {
    return new Observable<string>(observe => {
      this.http
          .get('https://imdb8.p.rapidapi.com/title/auto-complete', {
            headers: {
              'x-rapidapi-key': '792ceedef1msh79e30f5c4b46eb7p15136djsn214c0784a07b',
              'x-rapidapi-host': 'imdb8.p.rapidapi.com'
            },
            params: {
              q: name
            }
          })
          .subscribe((response: any) => {
            observe.next(response?.d[0]?.i?.imageUrl ?? './assets/poster-default.jpg');
          });
    });
  }
}
