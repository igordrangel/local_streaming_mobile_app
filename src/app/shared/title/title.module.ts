import { NgModule } from '@angular/core';
import { TitleComponent } from './title.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TitleComponent
  ],
  exports: [
    TitleComponent
  ],
  imports: [
    MatIconModule
  ]
})
export class TitleModule {
}
