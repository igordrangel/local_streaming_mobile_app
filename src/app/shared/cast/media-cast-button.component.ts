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

  constructor(public mediaCastService: MediaCastService) {
    mediaCastService.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.firstChange) {
      this.cast(false, this.enableSubtitle.getValue());
    }
  }

  public cast(disconnect = true, enableSubtitle: boolean) {
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
