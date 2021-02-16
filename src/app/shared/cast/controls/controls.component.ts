import { Component, Input } from "@angular/core";
import { GoogleCastState, MediaCastService } from "../media-cast.service";

@Component({
  selector: 'controls',
  templateUrl: 'controls.component.html',
  styleUrls: ['controls.component.css']
})
export class ControlsComponent {
  @Input() miniPlayer = false;
  public isPaused$ = GoogleCastState.isPaused;

  constructor(
    public mediaCastService: MediaCastService
  ) {
  }
}
