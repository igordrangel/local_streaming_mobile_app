import { Component, OnInit } from "@angular/core";
import { MediaInterface } from "../player/media-cast-player.component";
import { GoogleCastState } from "../media-cast.service";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, NavigationEnd, Route, Router } from "@angular/router";

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

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hide$.next(event.url.indexOf('/video/') >= 0);
      }
    });

    GoogleCastState.isConnected.subscribe(isConnected => {
      this.video$.next(isConnected ? {
        poster: GoogleCastState.googleCast.poster,
        title: GoogleCastState.googleCast.title,
        subtitle: GoogleCastState.googleCast.description
      } : null);
    });
  }
}
