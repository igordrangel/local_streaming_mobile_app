import { Component, OnDestroy, OnInit } from "@angular/core";
import { GoogleCastState } from "../media-cast.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ID_VIDEO_STORAGE_NAME } from "../../../video/video.component";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";
import { debounceTime } from "rxjs/operators";

export const MINIPLAYER_STATE_STORAGE_NAME = 'lsMiniplayerState';

export interface MiniPlayerInterface {
  poster: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'mini-player',
  templateUrl: 'mini-player.component.html',
  styleUrls: ['mini-player.component.css']
})
export class MiniPlayerComponent implements OnInit, OnDestroy {
  public hide$ = new BehaviorSubject<boolean>(false);
  public video$ = new BehaviorSubject<MiniPlayerInterface>(null);
  public animateHide$ = new BehaviorSubject<boolean>(false);
  public redirectTo = '/video/' + localStorage.getItem(ID_VIDEO_STORAGE_NAME);
  private castConnected = false;
  private castConnectInterval: any;

  constructor(private router: Router) {
  }

  ngOnDestroy() {
    clearInterval(this.castConnectInterval);
  }

  ngOnInit() {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        const hide = this.isCurrentVideoPage(event.url);
        this.animateHide$.next(hide);
        await KlDelay.waitFor(300);
        this.hide$.next(hide);
      }
    });

    GoogleCastState.changeVideo.pipe(debounceTime(1000)).subscribe(async () => await this.updateState());
    this.castConnectInterval = setInterval(async () => {
      if (
        localStorage.getItem(ID_VIDEO_STORAGE_NAME) &&
        localStorage.getItem(ID_VIDEO_STORAGE_NAME) !== 'null'
      ) {
        this.redirectTo = '/video/' + localStorage.getItem(ID_VIDEO_STORAGE_NAME);
      }
      localStorage.setItem(MINIPLAYER_STATE_STORAGE_NAME, `${!this.hide$.getValue() && !!this.video$.getValue() && !!this.video$.getValue()?.title}`);
      if (this.castConnected !== GoogleCastState.googleCast.connected) {
        this.castConnected = GoogleCastState.googleCast.connected;
        await this.updateState();
      }
    }, 300);
  }

  private isCurrentVideoPage(url?: string) {
    return (url ?? location.href).indexOf('/video/' + localStorage.getItem(ID_VIDEO_STORAGE_NAME)) >= 0;
  }

  private async updateState() {
    this.animateHide$.next(!GoogleCastState.googleCast.connected);
    await KlDelay.waitFor(300);
    this.hide$.next(this.isCurrentVideoPage());
    this.video$.next(GoogleCastState.googleCast.connected ? {
      poster: GoogleCastState.googleCast.poster,
      title: GoogleCastState.googleCast.title,
      subtitle: GoogleCastState.googleCast.description
    } : null);
    if (!GoogleCastState.googleCast.connected) {
      localStorage.removeItem(ID_VIDEO_STORAGE_NAME);
    }
  }
}
