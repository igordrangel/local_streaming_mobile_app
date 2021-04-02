import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GoogleCastState, MediaCastService, VideoCast } from './media-cast.service';
import { BehaviorSubject } from "rxjs";
import { ID_VIDEO_STORAGE_NAME } from "../../video/video.component";

@Component({
  selector: 'media-cast',
  templateUrl: 'media-cast-button.component.html',
  styleUrls: ['media-cast-button.component.css']
})
export class MediaCastButtonComponent implements OnInit, OnChanges {
  @Input() video: VideoCast;
  @Input() enableSubtitle: BehaviorSubject<boolean>;

  public isAvailable$ = GoogleCastState.isAvailable;
  public isConnected$ = GoogleCastState.isConnected;

  private firstLoad = true;

  constructor(public mediaCastService: MediaCastService) {
    mediaCastService.init();
  }

  ngOnInit() {
    this.isConnected$.subscribe(isConnected => {
      if (isConnected) {
        this.setIdVideoInStorage();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstLoad && this.isConnected$.getValue()) {
      this.cast(false, this.enableSubtitle.getValue());
    } else if (this.firstLoad && this.isConnected$.getValue()) {
      this.firstLoad = false;
      this.setIdVideoInStorage(false);
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

  private setIdVideoInStorage(update = true) {
    if (update || (!update && !localStorage.getItem(ID_VIDEO_STORAGE_NAME))) {
      const arrVideoUrl = location.href.split('/');
      const idVideo = arrVideoUrl[arrVideoUrl.length - 1];
      setTimeout(() => localStorage.setItem(ID_VIDEO_STORAGE_NAME, idVideo), 300);
    }
  }
}
