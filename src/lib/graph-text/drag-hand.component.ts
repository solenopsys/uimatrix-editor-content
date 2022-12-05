import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'fui-drag-handle-text',
  template: '<div draggable="true" style="min-width: 18px;   border-left: 3px solid black; height: 100%;   position: relative;" >' +
    '<fui-icon-button [icon]="dragIcon" ></fui-icon-button>  ' +
    '</div>',
})
export class DragHangComponent implements OnInit{
  dragIcon = '/assets/icons/01-Interface-Essential/48-Select/hand-drag.svg'

  ngOnInit(): void {
  }
}
