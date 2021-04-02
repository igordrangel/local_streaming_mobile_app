import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Castjs } from "./player/cast/googlecast";

export interface VideoCast {
  posterSrc?: string;
  videoSrc: string;
  subtitleSrc: string;
  title: string;
  description: string;
}

export class GoogleCastState {
  public static intervalSession: any;
  public static isPaused = new BehaviorSubject<boolean>(false);
  public static isAvailable = new BehaviorSubject<boolean>(false);
  public static isConnected = new BehaviorSubject<boolean>(false);
  public static changeVideo = new BehaviorSubject<boolean>(false);
  public static googleCast = new Castjs();
}

@Injectable({providedIn: 'root'})
export class MediaCastService {

  public init() {
    GoogleCastState.isPaused.subscribe(isPaused => isPaused ? GoogleCastState.googleCast.pause() : GoogleCastState.googleCast.play());
    GoogleCastState.isAvailable.next(GoogleCastState.googleCast.available);
    GoogleCastState.isConnected.next(GoogleCastState.googleCast.connected);
    GoogleCastState.googleCast.on('connect', () => {
      GoogleCastState.isConnected.next(true);
      GoogleCastState.intervalSession = setInterval(() => {
        if (GoogleCastState.googleCast.connected !== GoogleCastState.isConnected.getValue()) {
          GoogleCastState.isConnected.next(GoogleCastState.googleCast.connected);
        }
      }, 5000);
    });
    GoogleCastState.googleCast.on('disconnect', () => {
      GoogleCastState.isConnected.next(false);
      clearInterval(GoogleCastState.intervalSession);
    });
  }

  public cast(video: VideoCast, enableSubtitle = false) {
    GoogleCastState.changeVideo.next(true);
    GoogleCastState.googleCast.cast(video.videoSrc, {
      poster: video.posterSrc,
      title: video.title,
      description: video.description,
      subtitles: [{
        active: enableSubtitle,
        label: 'Português Brasil',
        src: video.subtitleSrc
      }],
    });
  }

  public playPause() {
    GoogleCastState.isPaused.next(!GoogleCastState.isPaused.getValue());
  }

  public back() {
    let goback = GoogleCastState.googleCast.time - 10;
    if (goback < 1) {
      goback = 0;
    }
    GoogleCastState.googleCast.seek(goback);
  }

  public forward() {
    let goforward = GoogleCastState.googleCast.time + 10;
    if (goforward < 1) {
      goforward = 0;
    }
    GoogleCastState.googleCast.seek(goforward);
  }

  public seek(time: number) {
    GoogleCastState.googleCast.seek(time);
  }

  public disableSubtitle() {
    GoogleCastState.googleCast.subtitle(1);
  }

  public enableSubtitle() {
    GoogleCastState.googleCast.subtitle(0);
  }

  public disconnect() {
    GoogleCastState.googleCast.disconnect();
  }
}
