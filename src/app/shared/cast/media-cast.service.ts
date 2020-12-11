import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class MediaCastService {
  private remotePlayer: any;
  private remotePlayerController: any;
  private connected$ = new BehaviorSubject<boolean>(false);
  
  public isAvailable() {
    return new Promise<boolean>(resolve => window['__onGCastApiAvailable'] = (isAvailable) => resolve(isAvailable));
  }
  
  public connection() {
    return this.connected$;
  }
  
  public getRemotePlayer() {
    return {
      player: this.remotePlayer,
      controller: this.remotePlayerController
    };
  }
  
  public init() {
    // @ts-ignore
    cast.framework.CastContext.getInstance().setOptions({
      // @ts-ignore
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    });
    
    // @ts-ignore
    this.remotePlayer = new cast.framework.RemotePlayer();
    // @ts-ignore
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    // @ts-ignore
    this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      (isConnected: any) => {
        this.connected$.next(isConnected.value);
      });
  }
}
