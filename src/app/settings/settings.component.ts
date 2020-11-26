import { Component, OnInit } from '@angular/core';
import { DynamicFormTypeFieldEnum, KoalaDynamicFormFieldInterface } from 'ngx-koala';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IP } from '../core/local-streaming.service';

@Component({
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css']
})
export class SettingsComponent implements OnInit {
  public formSettings: FormGroup;
  public formSettingsConfig: KoalaDynamicFormFieldInterface[];
  
  constructor(
    private fb: FormBuilder
  ) {}
  
  ngOnInit() {
    this.formSettings = this.fb.group({});
    this.formSettingsConfig = [{
      label: 'Informe o IP Local de seu servidor:',
      name: 'ip',
      type: DynamicFormTypeFieldEnum.text,
      appearance: 'outline',
      floatLabel: 'always',
      class: 'col-12',
      fieldClass: 'w-100',
      required: true,
      value: IP(),
      valueChanges: value => localStorage.setItem('localStreamingIp', value)
    }];
  }
}
