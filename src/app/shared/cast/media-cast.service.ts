import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MediaCastService {
  
  public isAvailable() {
    return new Promise<boolean>(resolve => window['__onGCastApiAvailable'] = (isAvailable) => resolve(isAvailable));
  }
  
  public init() {
    // @ts-ignore
    cast.framework.CastContext.getInstance().setOptions({
      // @ts-ignore
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      // @ts-ignore
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
  }
}
