import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormTypeFieldEnum, KoalaDynamicFormFieldInterface, KoalaDynamicFormService } from 'ngx-koala';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoInterface } from '../core/interfaces/video.interface';
import { LocalStreamingService } from '../core/local-streaming.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { koala } from 'koala-utils';
import { MINIPLAYER_STATE_STORAGE_NAME } from "../shared/cast/mini-player/mini-player.component";

@Component({
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  public formFilter: FormGroup;
  public formFilterConfig: KoalaDynamicFormFieldInterface[];
  public videos$: Observable<VideoInterface[]>;
  public categoriaTranslate = VideoCategoriaEnumTranslate;
  public miniPlayer$ = new BehaviorSubject<boolean>(false);
  private miniplayerInterval: any;

  constructor(
    private fb: FormBuilder,
    private dynamicFormService: KoalaDynamicFormService,
    private localStreamingService: LocalStreamingService
  ) {
  }

  ngOnDestroy() {
    clearInterval(this.miniplayerInterval);
  }

  ngOnInit() {
    this.formFilter = this.fb.group({});
    this.formFilterConfig = [{
      label: 'Busque por título',
      name: 'titulo',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-12',
      fieldClass: 'w-100',
      valueChanges: () => this.videos$ = this.getLista().pipe(debounceTime(300))
    }];
    setTimeout(() => this.videos$ = this.getLista(), 1);
    this.miniplayerInterval = setInterval(() => {
      this.miniPlayer$.next(localStorage.getItem(MINIPLAYER_STATE_STORAGE_NAME) === 'true');
    }, 300);
  }

  private getLista() {
    return this.localStreamingService
               .getLista(
                 koala(this.dynamicFormService.emitData(this.formFilter))
                   .object()
                   .merge({
                     sort: 'e.id',
                     order: 'DESC',
                     page: 0,
                     limit: 100
                   })
                   .getValue()
               )
               .pipe(switchMap(videos => {
                 return new Observable<VideoInterface[]>(observe => {
                   videos.map(video => {
                     video.poster = video.poster ?? './assets/poster-default.jpg';
                   });
                   observe.next(videos);
                 });
               }));
  }
}
