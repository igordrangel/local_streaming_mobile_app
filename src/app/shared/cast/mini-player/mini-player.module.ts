import { NgModule } from "@angular/core";
import { MiniPlayerComponent } from "./mini-player.component";
import { CommonModule } from "@angular/common";
import { ControlsModule } from "../controls/controls.module";
import { MatRippleModule } from "@angular/material/core";

@NgModule({
  exports: [
    MiniPlayerComponent
  ],
  declarations: [
    MiniPlayerComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    MatRippleModule
  ]
})
export class MiniPlayerModule {}
