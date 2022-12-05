import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ContentNodesGroup, DragState, TextNodeType} from "../store/model";
import {distinctUntilChanged, Observable, Subject, Subscription} from "rxjs";
import {
  ContentGroupState,
  DropNode,
  EndDragNode,
  NewGroupNode,
  OverDragNode,
  StartDragNode
} from "../store/content-groups.store";
import {Select, Store} from "@ngxs/store";


@Component({
  selector: 'fui-graph-text',
  templateUrl: './graph-text.component.html',
  styleUrls: ['./graph-text.component.css']
})
export class GraphTextComponent implements OnInit, OnDestroy {
  NODES_TYPES = TextNodeType;
  nodesGroup$!: Observable<ContentNodesGroup | undefined>
  groupID!: string
  overDragFilter = new Subject<number>()
  subscription!: Subscription;

  @ViewChildren('cmp') components!: QueryList<any>;


  @Select(ContentGroupState.getDragAndDrop) dragAndDropState$!: Observable<DragState>;


  constructor(public store: Store) {
  }

  ngOnInit(): void {
    this.subscription = this.overDragFilter.pipe(distinctUntilChanged()).subscribe(i => {
      this.store.dispatch(new OverDragNode(this.groupID, i))
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @Input('groupID')
  set setGroupID(groupID: string) {
    this.groupID = groupID;
    this.nodesGroup$ = this.store.select(ContentGroupState.getGroupByFID(groupID));
  }

  add(blocks: string[]) {
    this.store.dispatch(new NewGroupNode(this.groupID, blocks.length, '', TextNodeType.PARAGRAPH))
  }

  startDrag(i: number) {
    this.store.dispatch(new StartDragNode(this.groupID, i))
  }

  endDrag(i: number) {
    this.store.dispatch(new EndDragNode(this.groupID, i))
  }

  overDrag(i: number, $event: any) {
    console.log();
    console.log($event);
    const elem = this.components.toArray()[i]
    let mousePositionY = $event.offsetY;
    let height = elem.nativeElement.offsetHeight;
    let second = mousePositionY / height > 0.5
    this.overDragFilter.next(second ? i + 1: i);
  }

  remove(blocksIndex: number) {
    this.store.dispatch(new DropNode(this.groupID, blocksIndex))
  }
}
