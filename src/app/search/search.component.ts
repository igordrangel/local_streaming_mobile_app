import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormTypeFieldEnum, KoalaDynamicFormFieldInterface, KoalaDynamicFormService } from 'ngx-koala';
import { Observable } from 'rxjs';
import { VideoInterface } from '../core/interfaces/video.interface';
import { LocalStreamingService } from '../core/local-streaming.service';
import { debounceTime } from 'rxjs/operators';
import { VideoCategoriaEnumTranslate } from '../core/enums/translate/video-categoria.enum.translate';
import { koala } from 'koala-utils';

@Component({
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})
export class SearchComponent implements OnInit {
  public formFilter: FormGroup;
  public formFilterConfig: KoalaDynamicFormFieldInterface[];
  public videos$: Observable<VideoInterface[]>;
  public categoriaTranslate = VideoCategoriaEnumTranslate;

  constructor(
    private fb: FormBuilder,
    private dynamicFormService: KoalaDynamicFormService,
    private localStreamingService: LocalStreamingService
  ) {
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
               );
  }
}
