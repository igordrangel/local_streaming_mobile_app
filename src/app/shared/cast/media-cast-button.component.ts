import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleCastState, MediaCastService, VideoCast } from './media-cast.service';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'media-cast',
  templateUrl: 'media-cast-button.component.html',
  styleUrls: ['media-cast-button.component.css']
})
export class MediaCastButtonComponent implements OnChanges {
  @Input() video: VideoCast;
  @Input() enableSubtitle: BehaviorSubject<boolean>;

  public isAvailable$ = GoogleCastState.isAvailable;
  public isConnected$ = GoogleCastState.isConnected;

  private firstLoad = true;

  constructor(public mediaCastService: MediaCastService) {
    mediaCastService.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.firstLoad);
    if (!this.firstLoad && this.isConnected$.getValue()) {
      this.cast(false, this.enableSubtitle.getValue());
    } else if (this.firstLoad && this.isConnected$.getValue()) {
      this.firstLoad = false;
    }
  }

  public cast(disconnect = true, enableSubtitle: boolean) {
    this.firstLoad = false;
    if (
      (this.isAvailable$.getValue() && !this.isConnected$.getValue()) ||
      (this.isConnected$.getValue() && !disconnect)
    ) {
      this.mediaCastService.cast(this.video, enableSubtitle);
    } else if (this.isConnected$.getValue() && disconnect) {
      this.mediaCastService.disconnect();
    }
  }
}
