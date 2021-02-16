import { NgModule } from "@angular/core";
import { ControlsComponent } from "./controls.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  exports: [
    ControlsComponent
  ],
  declarations: [
    ControlsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ControlsModule {}
