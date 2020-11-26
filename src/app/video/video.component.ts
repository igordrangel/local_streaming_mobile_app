import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IP, LocalStreamingService } from '../core/local-streaming.service';
import { ActivatedRoute } from '@angular/router';
import { VideoArquivoInterface } from '../core/interfaces/video-arquivo.interface';
import { VideoInterface } from '../core/interfaces/video.interface';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';
import { BehaviorSubject } from 'rxjs';
import { KlDelay } from 'koala-utils/dist/utils/KlDelay';

@Component({
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {
  public videoSelectedSubject = new BehaviorSubject<{ src: string; type: string; }>(null);
  public src: string;
  public type: string;
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
    this.videoSelectedSubject.next({
      src: `http://${IP()}:3000/video/${this.id}/${arquivo.filename}`,
      type: arquivo.type
    });
  }
}
