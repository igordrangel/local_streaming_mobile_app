import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaCastButtonComponent } from './media-cast-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaCastPlayerComponent } from './player/media-cast-player.component';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    MediaCastButtonComponent,
    MediaCastPlayerComponent
  ],
  exports: [
    MediaCastButtonComponent,
    MediaCastPlayerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ]
})
export class MediaCastModule {
}
