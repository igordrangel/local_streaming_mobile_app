import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private intervalTimer: number;
  
  ngAfterViewInit() {
    setTimeout(() => this.calcTimer(), 300);
  }
  
  public formatLabel(value: number) {
    if (value > 0) {
      return value + 'k';
    }
    
    return value;
  }
  
  public play() {
    this.videoRef
        .nativeElement
        .play()
        .then(() => {
          this.intervalTimer = setInterval(() => {
            this.calcTimer();
          }, 1000);
        });
  }
  
  public pause() {
    clearInterval(this.intervalTimer);
    this.videoRef.nativeElement.pause();
  }
  
  public stop() {
    clearInterval(this.intervalTimer);
    this.videoRef.nativeElement.currentTime = 0;
    this.videoRef.nativeElement.pause();
    this.initTimer();
  }
  
  private calcTimer() {
    const video = this.videoRef.nativeElement;
    const duration = video.duration;
    const currentTime = Math.round((video.currentTime / video.duration) * 100);
    this.controlsReproduction$.next({
      labelCurrentTime: this.getDurationString(video.currentTime),
      labelDurationTime: this.getDurationString(video.duration ?? 0),
      currentTime,
      duration
    });
  }
  
  private getDurationString(durationInSec: number) {
    let durationString = '' + Math.floor(durationInSec % 60);
    const durationInMin = Math.floor(durationInSec / 60);
    if (durationInMin === 0) {
      return durationString;
    }
    durationString = (durationInMin % 60) + ':' + durationString;
    const durationInHour = Math.floor(durationInMin / 60);
    if (durationInHour === 0) {
      return durationString;
    }
    return durationInHour + ':' + durationString;
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
