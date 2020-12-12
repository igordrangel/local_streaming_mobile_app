import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material/slider';
import { MediaCastService } from '../media-cast.service';
import { PlayerHandler } from './player-handler';
// @ts-ignore
import RemotePlayer = cast.framework.RemotePlayer;
// @ts-ignore
import RemotePlayerController = cast.framework.RemotePlayerController;

export interface MediaInterface {
  title: string;
  subtitle: string;
  videoSrc: string;
  videoType: string;
  subtitleSrc?: string;
}

@Component({
  selector: 'media-cast-player',
  templateUrl: 'media-cast-player.component.html',
  styleUrls: ['media-cast-player.component.css']
})
export class MediaCastPlayerComponent implements AfterViewInit {
  @Input() media$: BehaviorSubject<MediaInterface>;
  public controlsReproduction$ = new BehaviorSubject<{
    labelCurrentTime: string;
    labelDurationTime: string;
    currentTime: number;
    duration: number;
  }>(null);
  @ViewChild('video', {static: false}) public videoRef: ElementRef<HTMLVideoElement>;
  public isPaused$ = new BehaviorSubject<boolean>(true);
  public playerHandler: PlayerHandler;
  public loader$ = new BehaviorSubject<boolean>(false);
  private intervalTimer: number;
  private remotePlayer: RemotePlayer;
  private remotePlayerController: RemotePlayerController;
  
  constructor(public mediaCastService: MediaCastService) {}
  
  ngAfterViewInit() {
    this.media$.pipe(debounceTime(1000)).subscribe(media => {
      setTimeout(async () => {
        this.videoRef.nativeElement.pause();
        this.mediaCastService
            .connection()
            .subscribe(isConnected => {
              this.remotePlayer = null;
              this.remotePlayerController = null;
              this.isPaused$.next(true);
              if (isConnected) {
                const remotePlayer = this.mediaCastService.getRemotePlayer();
                this.remotePlayer = remotePlayer.player;
                this.remotePlayerController = remotePlayer.controller;
                this.setupRemotePlayer();
              } else {
                this.setupLocalPlayer();
              }
              this.calcTimer();
            });
      }, 1);
    });
  }
  
  public timeChange(sliderChange: MatSliderChange) {
    const value = sliderChange.value;
    if (!this.playerHandler.isPaused()) {
      this.playerHandler.pause();
      const subscription = this.controlsReproduction$.pipe(debounceTime(300)).subscribe(() => {
        this.playerHandler.play();
        subscription.unsubscribe();
      });
    }
    this.videoRef.nativeElement.currentTime = value;
    this.calcTimer();
  }
  
  public setupLocalPlayer() {
    const playerTarget: any = {};
    playerTarget.play = () => {
      this.videoRef
          .nativeElement
          .play()
          .then(() => {
            this.isPaused$.next(this.playerHandler.isPaused());
            this.intervalTimer = setInterval(() => {
              this.calcTimer();
            }, 1000);
          });
    };
    playerTarget.isPaused = () => {
      return this.videoRef.nativeElement.paused;
    };
    playerTarget.pause = () => {
      clearInterval(this.intervalTimer);
      this.videoRef.nativeElement.pause();
      this.isPaused$.next(this.playerHandler.isPaused());
    };
    playerTarget.stop = () => {
      clearInterval(this.intervalTimer);
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.pause();
      this.isPaused$.next(this.playerHandler.isPaused());
      this.initTimer();
      this.calcTimer();
    };
    playerTarget.getCurrentMediaTime = () => {
      return this.videoRef.nativeElement.currentTime;
    };
    playerTarget.getMediaDuration = () => {
      return this.videoRef.nativeElement.duration;
    };
    this.playerHandler = new PlayerHandler(playerTarget, this.remotePlayer, this.media$.getValue());
  }
  
  public setupRemotePlayer() {
    // @ts-ignore
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    // @ts-ignore
    this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED, () => {
      if (this.remotePlayer.isPaused) {
        this.playerHandler.pause();
      } else {
        this.playerHandler.play();
      }
    });
    const playerTarget: any = {};
    playerTarget.play = () => {
      if (this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }
      this.isPaused$.next(this.playerHandler.isPaused());
      this.intervalTimer = setInterval(() => {
        this.calcTimer();
      }, 1000);
    };
    playerTarget.isPaused = () => {
      return this.remotePlayer.isPaused;
    };
    playerTarget.pause = () => {
      if (!this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }
      this.isPaused$.next(this.playerHandler.isPaused());
    };
    playerTarget.stop = () => {
      this.remotePlayerController.stop();
      this.isPaused$.next(this.playerHandler.isPaused());
    };
    playerTarget.load = (mediaData: MediaInterface) => {
      this.loader$.next(true);
      // @ts-ignore
      const mediaInfo = new chrome.cast.media.MediaInfo(mediaData.videoSrc, mediaData.videoType);
      // @ts-ignore
      mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
      // @ts-ignore
      mediaInfo.metadata.metadataType = chrome.cast.media.StreamType.BUFFERED;
      mediaInfo.metadata.title = mediaData.title;
      mediaInfo.metadata.subtitle = mediaData.subtitle;
  
      if (mediaData.subtitleSrc) {
        // @ts-ignore
        const subtitle = new chrome.cast.media.Track(1, chrome.cast.media.TrackType.TEXT);
        subtitle.trackContentId = mediaData.subtitleSrc;
        subtitle.trackContentType = 'text/vtt';
        // @ts-ignore
        subtitle.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
        subtitle.name = 'Português (Brasil)';
        subtitle.language = 'pt-BR';
        mediaInfo.tracks = [subtitle];
        mediaInfo.activeTrackIds = [1];
      }
  
      // @ts-ignore
      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      castSession.loadMedia(request).then(() => {
        this.playerHandler.setLoaded();
        this.loader$.next(false);
      });
    };
    playerTarget.getCurrentMediaTime = () => {
      return this.remotePlayer.currentTime;
    };
    playerTarget.getMediaDuration = () => {
      return this.remotePlayer.duration;
    };
    playerTarget.seekTo = (time) => {
      this.remotePlayer.currentTime = time;
      this.remotePlayerController.seek();
    };
    this.playerHandler = new PlayerHandler(playerTarget, this.remotePlayer, this.media$.getValue());
  }
  
  public switchPlayer() {
    clearInterval(this.intervalTimer);
    this.initTimer();
    this.playerHandler.stop();
    // @ts-ignore
    if (cast && cast.framework) {
      if (this.remotePlayer.isConnected) {
        this.setupRemotePlayer();
        return;
      }
    }
    this.setupLocalPlayer();
  }
  
  private calcTimer() {
    const duration = (`${this.playerHandler.getCurrentTime()}` !== 'NaN' ? this.playerHandler.getDurationTime() : 0);
    this.controlsReproduction$.next({
      labelCurrentTime: this.getDurationString(this.playerHandler.getCurrentTime()),
      labelDurationTime: this.getDurationString(duration),
      currentTime: this.playerHandler.getCurrentTime(),
      duration: duration
    });
  }
  
  private getDurationString(durationInSec: number) {
    let durationString = '' + Math.floor(durationInSec % 60);
    if (parseInt(durationString) < 10) {
      durationString = '0' + durationString;
    }
  
    let durationInMin = '' + Math.floor(durationInSec / 60);
    if (parseInt(durationInMin) < 10) {
      durationInMin = '0' + durationInMin;
    }
  
    let durationInHour = '' + Math.floor(parseInt(durationInMin) / 60);
    if (parseInt(durationInHour) < 10) {
      durationInHour = '0' + durationInHour;
    }
  
    if (parseInt(durationInMin) === 0) {
      return '00:00:' + durationString;
    } else if (parseInt(durationInHour) === 0) {
      return `00:${durationInMin}:${durationString}`;
    } else {
      durationInMin = '' + (parseInt(durationInMin) % 60);
      if (parseInt(durationInMin) < 10) {
        durationInMin = '0' + durationInMin;
      }
      return `${durationInHour}:${durationInMin}:${durationString}`;
    }
  }
  
  private initTimer() {
    this.controlsReproduction$.next({
      labelCurrentTime: '00:00:00',
      labelDurationTime: '00:00:00',
      currentTime: 0,
      duration: 0
    });
  }
}
