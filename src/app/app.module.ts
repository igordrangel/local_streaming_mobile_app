import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { VideoComponent } from './video/video.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  KoalaButtonModule,
  KoalaDialogModule,
  KoalaDialogService,
  KoalaFormModule,
  KoalaQuestionModule,
  KoalaQuestionService
} from 'ngx-koala';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { TitleModule } from './shared/title/title.module';
import { MediaCastModule } from './shared/cast/media-cast.module';
import { MiniPlayerModule } from "./shared/cast/mini-player/mini-player.module";
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    SearchComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MediaCastModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    KoalaFormModule,
    KoalaQuestionModule,
    KoalaDialogModule,
    TitleModule,
    MiniPlayerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    AppRoutingModule
  ],
  providers: [
    KoalaQuestionService,
    KoalaDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
