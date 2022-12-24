import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'ui-drag-handle-text',
  template: '<div draggable="true" style="min-width: 18px;   border-left: 3px solid black; height: 100%;   position: relative;" >' +
    '<ui-icon-button [icon]="dragIcon" ></ui-icon-button>  ' +
    '</div>',
})
export class DragHangComponent implements OnInit{
  dragIcon = '/assets/icons/01-Interface-Essential/48-Select/hand-drag.svg'

  ngOnInit(): void {
  }
}
