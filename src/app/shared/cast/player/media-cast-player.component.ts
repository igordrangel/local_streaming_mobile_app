import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material/slider';

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
    this.media$.pipe(debounceTime(1000)).subscribe(() => {
      setTimeout(() => {
        this.pause();
        this.calcTimer();
      }, 1);
    });
  }
  
  public timeChange(sliderChange: MatSliderChange) {
    const value = sliderChange.value;
    if (!this.videoRef.nativeElement.paused) {
      this.pause();
      const subscription = this.controlsReproduction$.pipe(debounceTime(300)).subscribe(() => {
        this.play();
        subscription.unsubscribe();
      });
    }
    this.videoRef.nativeElement.currentTime = value;
    this.calcTimer();
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
    this.calcTimer();
  }
  
  private calcTimer() {
    const video = this.videoRef.nativeElement;
    const duration = (`${video.duration}` !== 'NaN' ? video.duration : 0);
    this.controlsReproduction$.next({
      labelCurrentTime: this.getDurationString(video.currentTime),
      labelDurationTime: this.getDurationString(duration),
      currentTime: video.currentTime,
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
