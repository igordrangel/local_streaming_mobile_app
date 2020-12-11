import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IP, LocalStreamingService } from '../core/local-streaming.service';
import { ActivatedRoute } from '@angular/router';
import { VideoArquivoInterface } from '../core/interfaces/video-arquivo.interface';
import { VideoInterface } from '../core/interfaces/video.interface';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';
import { BehaviorSubject } from 'rxjs';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';
import { koala } from 'koala-utils';
import { MediaInterface } from '../shared/cast/player/media-cast-player.component';

interface ListaArquivos {
  temporada: number;
  arquivos: VideoArquivoInterface[];
}

@Component({
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {
  public videoSelectedSubject = new BehaviorSubject<MediaInterface>(null);
  public video: VideoInterface;
  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public tipoEnum = VideoTipoEnum;
  private id: number;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStreamingService: LocalStreamingService
  ) {}
  
  ngOnInit() {
    this.activatedRoute
        .paramMap
        .subscribe(async param => {
          this.id = parseInt(param.get('id'));
          this.localStreamingService
              .getPorId(this.id)
              .subscribe(video => {
                this.video = video;
                this.selectVideo(this.video.arquivos[0]);
              });
        });
  }
  
  public async selectVideo(arquivo: VideoArquivoInterface) {
    this.videoSelectedSubject.next(null);
    await KlDelay.waitFor(50);
    const sourceMedia = `http://${IP()}:3000/video/${this.id}/${arquivo.filename}`;
    this.videoSelectedSubject.next({
      subtitleSrc: (arquivo.legendaFilename ?
          `http://${IP()}:3000/video/${this.id}/${arquivo.legendaFilename.replace('.srt', '.vtt')}` :
          null
      ),
      videoSrc: sourceMedia,
      videoType: arquivo.type,
      title: this.video.tituloOriginal,
      subtitle: arquivo.titulo
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
