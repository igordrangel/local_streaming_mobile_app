import { Component } from '@angular/core';
import { LocalStreamingService } from '../core/local-streaming.service';
import { VideoInterface } from '../core/interfaces/video.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { switchMap } from 'rxjs/operators';
import { PosterInterface } from '../core/interfaces/poster.interface';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public videos$ = this.localStreamingService
                       .getLista({})
                       .pipe(switchMap(videos => {
                         return new Observable<VideoInterface[]>(observe => {
                           videos.map(video => {
                             video.poster = new BehaviorSubject<PosterInterface>({
                               src: './assets/poster-default.jpg',
                               alt: 'Video de Teste'
                             });
                           });
                           observe.next(videos);
                         });
                       }));
  public filmes$ = this.localStreamingService
                       .getLista({tipo: VideoTipoEnum.filme})
                       .pipe(switchMap(videos => {
                         return new Observable<VideoInterface[]>(observe => {
                           videos.map(video => {
                             video.poster = new BehaviorSubject<PosterInterface>({
                               src: './assets/poster-default.jpg',
                               alt: 'Video de Teste'
                             });
                           });
                           observe.next(videos);
                         });
                       }));
  public series$ = this.localStreamingService
                       .getLista({tipo: VideoTipoEnum.serie})
                       .pipe(switchMap(videos => {
                         return new Observable<VideoInterface[]>(observe => {
                           videos.map(video => {
                             video.poster = new BehaviorSubject<PosterInterface>({
                               src: './assets/poster-default.jpg',
                               alt: 'Video de Teste'
                             });
                           });
                           observe.next(videos);
                         });
                       }));
  
  constructor(
    private localStreamingService: LocalStreamingService
  ) {}
}
