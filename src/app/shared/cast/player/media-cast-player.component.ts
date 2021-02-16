import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GoogleCastState, MediaCastService, VideoCast } from '../media-cast.service';
import { ImdbService } from "../../services/imdb/imdb.service";
import { MatSliderChange } from "@angular/material/slider";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";

export interface MediaInterface {
  posterSrc?: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  videoType: string;
  subtitleSrc?: string;
}

export interface MediaProgress {
  timePretty: string;
  durationPretty: string;
  time: number;
  duration: number;
}

@Component({
  selector: 'media-cast-player',
  templateUrl: 'media-cast-player.component.html',
  styleUrls: ['media-cast-player.component.css']
})
export class MediaCastPlayerComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() media$: BehaviorSubject<MediaInterface>;
  public videoCast$ = new BehaviorSubject<VideoCast>(null);
  public mediaProgress$ = new BehaviorSubject<MediaProgress>({
    time: GoogleCastState.googleCast.time,
    timePretty: GoogleCastState.googleCast.timePretty,
    duration: GoogleCastState.googleCast.duration,
    durationPretty: GoogleCastState.googleCast.durationPretty
  });
  @ViewChild('video', {static: false}) public videoRef: ElementRef<HTMLVideoElement>;
  public subtitleOn$ = new BehaviorSubject<boolean>(false);
  public isPaused$ = GoogleCastState.isPaused;
  public loader$ = new BehaviorSubject<boolean>(true);
  public intervalTimer = 0;

  constructor(
    public mediaCastService: MediaCastService,
    private imdbService: ImdbService
  ) {
  }

  ngOnInit() {
    this.intervalTimer = setInterval(async () => {
      await KlDelay.waitFor(300);
      this.mediaProgress$.next({
        time: GoogleCastState.googleCast.time,
        timePretty: GoogleCastState.googleCast.timePretty,
        duration: GoogleCastState.googleCast.duration,
        durationPretty: GoogleCastState.googleCast.durationPretty
      });
    }, 700);
  }

  ngOnDestroy() {
    clearInterval(this.intervalTimer);
  }

  ngAfterViewInit() {
    this.media$.pipe(debounceTime(1000)).subscribe(media => {
      const video: VideoCast = {
        posterSrc: location.origin + '/assets/poster-default.jpg',
        title: media.title,
        description: media.subtitle,
        videoSrc: media.videoSrc,
        subtitleSrc: media.subtitleSrc
      };
      this.imdbService
          .getBanner(media.title)
          .subscribe(poster => {
            this.media$.getValue().posterSrc = poster;
            video.posterSrc = poster;
            this.videoCast$.next(video);
            this.loader$.next(false);
          }, () => {
            this.media$.getValue().posterSrc = './assets/movietime.jpg';
            video.posterSrc = './assets/movietime.jpg';
            this.loader$.next(false);
            this.videoCast$.next(video);
          });
    });
  }

  public toggleCaption() {
    if (this.subtitleOn$.getValue()) {
      this.subtitleOn$.next(false);
      this.mediaCastService.disableSubtitle();
    } else {
      this.subtitleOn$.next(true);
      this.mediaCastService.enableSubtitle();
    }
  }

  public seek(event: MatSliderChange) {
    this.mediaCastService.seek(event.value);
  }
}
