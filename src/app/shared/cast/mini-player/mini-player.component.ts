import { Component, OnInit } from "@angular/core";
import { GoogleCastState } from "../media-cast.service";
import { BehaviorSubject } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ID_VIDEO_STORAGE_NAME } from "../../../video/video.component";
import { KlDelay } from "koala-utils/dist/utils/KlDelay";

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
export class MiniPlayerComponent implements OnInit {
  public hide$ = new BehaviorSubject<boolean>(false);
  public video$ = new BehaviorSubject<MiniPlayerInterface>(null);
  public animateHide$ = new BehaviorSubject<boolean>(false);
  public redirectTo = '/video/' + localStorage.getItem(ID_VIDEO_STORAGE_NAME);

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        const hide = event.url.indexOf('/video/' + localStorage.getItem(ID_VIDEO_STORAGE_NAME)) >= 0;
        this.animateHide$.next(hide);
        await KlDelay.waitFor(300);
        this.hide$.next(hide);
      }
    });

    GoogleCastState.isConnected.subscribe(async isConnected => {
      this.animateHide$.next(!isConnected);
      await KlDelay.waitFor(300);
      this.video$.next(isConnected ? {
        poster: GoogleCastState.googleCast.poster,
        title: GoogleCastState.googleCast.title,
        subtitle: GoogleCastState.googleCast.description
      } : null);
      if (!isConnected) {
        localStorage.removeItem(ID_VIDEO_STORAGE_NAME);
      }
    });
    setTimeout(async () => {
      this.animateHide$.next(!GoogleCastState.googleCast.connected);
      await KlDelay.waitFor(300);
      this.video$.next(GoogleCastState.googleCast.connected ? {
        poster: GoogleCastState.googleCast.poster,
        title: GoogleCastState.googleCast.title,
        subtitle: GoogleCastState.googleCast.description
      } : null);
      if (!GoogleCastState.googleCast.connected) {
        localStorage.removeItem(ID_VIDEO_STORAGE_NAME);
      }
    }, 500);
  }
}
