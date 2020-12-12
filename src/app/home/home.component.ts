import { Component } from '@angular/core';
import { LocalStreamingService } from '../core/local-streaming.service';
import { VideoInterface } from '../core/interfaces/video.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PosterInterface } from '../core/interfaces/poster.interface';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';
import { ImdbService } from '../shared/services/imdb/imdb.service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  public videos$ = this.buscar();
  public filmes$ = this.buscar(VideoTipoEnum.filme);
  public series$ = this.buscar(VideoTipoEnum.serie);
  
  constructor(
    private localStreamingService: LocalStreamingService,
    private imdbService: ImdbService
  ) {}
  
  public buscar(tipo?: VideoTipoEnum) {
    const filter = {sort: 'e.id', order: 'DESC', page: 0, limit: 10, tipo: null};
    if (tipo) {
      filter.tipo = tipo;
    }
    return this.localStreamingService
               .getLista(filter)
               .pipe(switchMap(videos => {
                 return new Observable<VideoInterface[]>(observe => {
                   videos.map(video => {
                     video.poster = new BehaviorSubject<PosterInterface>({
                       src: './assets/poster-default.jpg',
                       alt: video.tituloOriginal
                     });
                     this.imdbService
                         .getPoster(video.tituloOriginal)
                         .subscribe(poster => video.poster.next({
                           src: poster,
                           alt: video.tituloOriginal
                         }));
                   });
                   observe.next(videos);
                 });
               }));
  }
}
