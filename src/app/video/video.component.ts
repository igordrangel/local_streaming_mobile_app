import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IP, LocalStreamingService } from '../core/local-streaming.service';
import { ActivatedRoute } from '@angular/router';
import { VideoArquivoInterface } from '../core/interfaces/video-arquivo.interface';
import { VideoInterface } from '../core/interfaces/video.interface';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';
import { koala } from 'koala-utils';
import { MediaInterface } from '../shared/cast/player/media-cast-player.component';
import { GoogleCastState } from "../shared/cast/media-cast.service";

export const ID_VIDEO_STORAGE_NAME = 'lsIdCurrentVideo';

interface ListaArquivos {
  temporada: number;
  arquivos: VideoArquivoInterface[];
}

@Component({
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit, OnDestroy {
  public videoSelectedSubject = new BehaviorSubject<MediaInterface>(null);
  public video: VideoInterface;
  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public tipoEnum = VideoTipoEnum;
  public showList$ = new BehaviorSubject<boolean>(false);
  public miniPlayer$ = new BehaviorSubject<boolean>(false);
  private id: number;
  private subscriptionGoogleCastConnection: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private localStreamingService: LocalStreamingService
  ) {}

  ngOnDestroy() {
    this.subscriptionGoogleCastConnection?.unsubscribe();
  }

  ngOnInit() {
    this.activatedRoute
        .paramMap
        .subscribe(async param => {
          this.id = parseInt(param.get('id'));
          this.localStreamingService
              .getPorId(this.id)
              .subscribe(async video => {
                this.video = video;
                let indexVideo = 0;
                await KlDelay.waitFor(500);
                if (GoogleCastState.googleCast.connected) {
                  indexVideo = koala(this.video.arquivos).array().getIndex('titulo', GoogleCastState.googleCast.description);
                }
                await this.selectVideo(this.video.arquivos[indexVideo]);
                this.showList$.next(!GoogleCastState.googleCast.connected);
                this.subscriptionGoogleCastConnection = GoogleCastState.isConnected.subscribe(isConnected => {
                  this.showList$.next(!isConnected);
                });
                await KlDelay.waitFor(300);
                if (this.miniPlayer$.getValue()) {
                  this.collapseList();
                }
              });
        });
  }

  public collapseList() {
    this.showList$.next(!this.showList$.getValue());
  }

  public async selectVideo(arquivo: VideoArquivoInterface) {
    this.videoSelectedSubject.next(null);
    await KlDelay.waitFor(50);
    const sourceMedia = arquivo ? `http://${IP()}:3000/video/${this.id}/${arquivo.filename}` : '';
    this.miniPlayer$.next(!arquivo);
    this.videoSelectedSubject.next({
      subtitleSrc: (arquivo?.legendaFilename ?
                    `http://${IP()}:3000/video/${this.id}/${arquivo.legendaFilename.replace('.srt', '.vtt')}` :
                    null
      ),
      videoSrc: sourceMedia,
      videoType: arquivo?.type ?? null,
      title: this.video.tituloOriginal,
      subtitle: arquivo?.titulo ?? null
    });
  }

  public verifyActiveVideo(arquivo: VideoArquivoInterface) {
    return arquivo ?
      this.videoSelectedSubject.getValue()?.videoSrc.indexOf(arquivo.filename) >= 0 :
      false;
  }

  public getListaArquivos(): ListaArquivos[] {
    return koala(this.video.arquivos)
      .array<VideoArquivoInterface>()
      .pipe(klArray => {
        const listaArquivos: ListaArquivos[] = [];

        klArray.getValue().forEach(arquivo => {
          const index = koala(listaArquivos).array<ListaArquivos>().getIndex('temporada', arquivo.temporada);
          if (index >= 0) {
            listaArquivos[index].arquivos.push(arquivo);
          } else {
            listaArquivos.push({
              temporada: arquivo.temporada,
              arquivos: [arquivo]
            });
          }
        });

        return listaArquivos;
      })
      .orderBy('temporada')
      .getValue();
  }
}
