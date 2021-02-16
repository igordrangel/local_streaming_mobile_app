import { NgModule } from "@angular/core";
import { MiniPlayerComponent } from "./mini-player.component";
import { CommonModule } from "@angular/common";
import { ControlsModule } from "../controls/controls.module";
import { MatRippleModule } from "@angular/material/core";
import { RouterModule } from "@angular/router";

@NgModule({
  exports: [
    MiniPlayerComponent
  ],
  declarations: [
    MiniPlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    MatRippleModule
  ]
})
export class MiniPlayerModule {}
