import { Component, OnInit } from '@angular/core';
import { LocalStreamingService } from '../core/local-streaming.service';
import { VideoInterface } from '../core/interfaces/video.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { switchMap } from 'rxjs/operators';
import { PosterInterface } from '../core/interfaces/poster.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormTypeFieldEnum, KoalaDynamicFormFieldInterface, KoalaDynamicFormService } from 'ngx-koala';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';
import { koala } from 'koala-utils';
import { videoTipoOptions } from '../core/video-tipo.options';
import { videoCategoriaOptions } from '../core/video-categoria.options';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  public formFilter: FormGroup;
  public formFilterConfig: KoalaDynamicFormFieldInterface[];
  
  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public videos$: Observable<VideoInterface[]>;
  
  constructor(
    private fb: FormBuilder,
    private dynamicFormService: KoalaDynamicFormService,
    private localStreamingService: LocalStreamingService
  ) {}
  
  ngOnInit() {
    this.formFilter = this.fb.group({});
    this.formFilterConfig = [{
      name: 'tipo',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'legacy',
      class: 'col-4 mr-8',
      fieldClass: 'w-100',
      opcoesSelect: videoTipoOptions,
      value: VideoTipoEnum.filme,
      valueChanges: () => this.videos$ = this.getLista()
    }, {
      name: 'categoria',
      type: DynamicFormTypeFieldEnum.select,
      appearance: 'legacy',
      class: 'col-7',
      fieldClass: 'w-100',
      opcoesSelect: koala([
        {name: 'Todos os gêneros', value: ''}
      ]).array<any>().merge(videoCategoriaOptions).getValue(),
      valueChanges: () => this.videos$ = this.getLista()
    }];
    setTimeout(() => this.videos$ = this.getLista(), 1);
  }
  
  private getLista() {
    return this.localStreamingService
               .getLista(this.dynamicFormService.emitData(this.formFilter))
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
  }
}
