import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {ContentNodeState, TypeChangeNode} from "../store/content-node.store";
import { BlockNode, TextNodeType } from "@solenopsys/uimatrix-editor-content";

@Component({
  selector: 'fui-node-editor',
  templateUrl: './node-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./node-editor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NodeEditorComponent {
  NODES_TYPES = TextNodeType;

  blockId!: string;

  block$! :Observable<BlockNode|undefined>

  @Input()
  index!: number;

  @Input()
  groupID!: string;

  constructor(private store: Store) {
  }

  @Input('blockId')
  set setBlockId(blockId: string) {
    this.blockId = blockId;
    this.block$ = this.store.select(ContentNodeState.getBlockById(blockId));
  }

  typeChange(type: TextNodeType) {
    this.store.dispatch(new TypeChangeNode(this.blockId, type))
  }
}
