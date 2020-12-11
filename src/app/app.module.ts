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
import { KoalaDialogModule, KoalaDialogService, KoalaFormModule, KoalaQuestionModule, KoalaQuestionService } from 'ngx-koala';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { TitleModule } from './shared/title/title.module';

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
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    KoalaFormModule,
    KoalaQuestionModule,
    KoalaDialogModule,
    TitleModule,
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
