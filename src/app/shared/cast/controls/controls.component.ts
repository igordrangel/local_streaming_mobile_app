import { Component, Input } from "@angular/core";
import { GoogleCastState, MediaCastService } from "../media-cast.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'controls',
  templateUrl: 'controls.component.html',
  styleUrls: ['controls.component.css']
})
export class ControlsComponent {
  @Input() miniPlayer = false;
  public isPaused$ = GoogleCastState.isPaused;
  public disabled$ = new BehaviorSubject<boolean>(false);

  constructor(
    public mediaCastService: MediaCastService
  ) {
  }

  public disabledAndAction(fn: () => void) {
    fn();
    this.disabled$.next(true);
    setTimeout(() => this.disabled$.next(false), 600);
  }
}
