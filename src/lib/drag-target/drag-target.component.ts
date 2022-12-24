import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import { DragState } from "@solenopsys/uimatrix-editor-content";

@Component({
  selector: 'ui-drag-target',
  templateUrl: './drag-target.component.html',
  styleUrls: ['./drag-target.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DragTargetComponent implements OnInit {
  @Input()
  dragAndDropState$!: Observable<DragState>;


  @Input()
  index!: number;

  @Input()
  groupID!: string;



  constructor(public store: Store) {
  }

  ngOnInit(): void {
  }
}
