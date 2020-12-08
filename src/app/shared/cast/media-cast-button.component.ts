import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaCastService } from './media-cast.service';

@Component({
  selector: 'media-cast',
  templateUrl: 'media-cast-button.component.html',
  styleUrls: ['media-cast-button.component.css']
})
export class MediaCastButtonComponent implements OnInit {
  public isAvailable$ = new BehaviorSubject<boolean>(false);
  
  constructor(public mediaCastService: MediaCastService) {}
  
  async ngOnInit() {
    this.isAvailable$.next(await this.mediaCastService.isAvailable());
    this.isAvailable$.subscribe(isAvailable => {
      if (isAvailable) {
        this.mediaCastService.init();
      }
    });
  }
}
