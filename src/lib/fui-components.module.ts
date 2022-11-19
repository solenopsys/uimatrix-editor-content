import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FreeSelectComponent} from "./free-select/free-select.component";
import {FormsModule} from "@angular/forms";
import {FreeSelectSaveComponent} from "./free-select-save/free-select-save.component";

import {ActionsButtonGroupComponent} from "./actions-button-group/actions-button-group.component";

import {VideoStreamComponent} from "./video-stream/video-stream.component";
import {PathTreeComponent} from "./path-tree/path-tree.component";
import { FuiIconsModule } from "@solenopsys/uimatrix-icons";
import { UtilsModule } from "@solenopsys/uimatrix-utils";

export interface ActionButton {
  key: string;
  title: string;
  icon: string;
}


@NgModule({
  declarations: [FreeSelectComponent, FreeSelectSaveComponent, ActionsButtonGroupComponent, VideoStreamComponent, PathTreeComponent],
  imports: [CommonModule, FormsModule, FuiIconsModule, UtilsModule],
  exports: [
    FreeSelectSaveComponent,
    ActionsButtonGroupComponent,
    FreeSelectComponent,
    PathTreeComponent
  ]
})
export class FuiComponentsModule {
}
