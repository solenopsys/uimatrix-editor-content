import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {filter, Observable} from "rxjs";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {BlockNode} from "../store/model";
import {
  ConcatNodes,
  DownFocusNode,
  DropNode, EditedGroup,
  SplitTextNode,
  UpFocusNode
} from "../store/content-groups.store";
import {ContentNodeState, SetFocusNode, UpdateValueNode} from "../store/content-node.store";


@Component({
  selector: 'fui-simple-text',
  templateUrl: './simple-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./simple-text.component.css']
})
export class SimpleTextComponent implements AfterViewInit, OnInit {

  @ViewChild('textDiv')
  textDiv!: ElementRef;

  @Input()
  index!: number;


  block$!: Observable<BlockNode | undefined>;

  blockId!: string;

  @Input()
  groupID!: string;

  value!: string | undefined;


  constructor(private store: Store, private actions$: Actions) {
  }

  @Input("blockId")
  set setBlock(blockId: string) {
    this.blockId = blockId;
    this.block$ = this.store.select(ContentNodeState.getBlockById(blockId));
    this.block$.subscribe(block => //todo subscribe
    {
      this.value = block?.value
      if (this.textDiv && block && this.textDiv.nativeElement.innerText !== block!.value) { //todo проверить корректность этого

        this.textDiv.nativeElement.innerText = block!.value
      }

    })
  }

  ngOnInit(): void {
    console.log("INTI TEXT")
    this.actions$.pipe(ofActionSuccessful(SetFocusNode)).pipe(filter((action: SetFocusNode) => {

        return action.id === this.blockId
      }
    )).subscribe((action: SetFocusNode) => {
      setTimeout(() => {
        this.selectAndSetCursor(action.point)
      }, 0)
    });
  }

  eventProcessing(event: any) {
    const nativeElement = this.textDiv?.nativeElement;
    // @ts-ignore
    const cursorPos = window.getSelection().anchorOffset;
    if (this.textDiv) {
      switch (event.key) {
        case 'Enter': {
          this.enter(cursorPos, nativeElement, event, this.index);
          break;
        }
        case 'Backspace': {
          this.backspace(cursorPos, nativeElement, event, this.index);
          break;
        }
        case 'ArrowUp': {
          this.up(cursorPos, nativeElement, event, this.index);
          break;
        }
        case 'ArrowDown': {
          this.down(cursorPos, nativeElement, event, this.index);
          break;
        }
        default: {
          this.value = nativeElement?.innerText;


        }
      }
    }
  }

  changeAction(event: any) {

    const nativeElement = this.textDiv?.nativeElement;
    const newValue = nativeElement?.innerText;

    if (this.value !== nativeElement?.innerText) {
      this.store.dispatch(new UpdateValueNode(this.blockId, newValue))
      this.store.dispatch(new EditedGroup(this.groupID))
    }
  }

  async selectAndSetCursor(point: number) {
    const el = this.textDiv.nativeElement;
    const setPoint = point === -1 ? el.innerText.length : point
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);

    if (el.childNodes[0] instanceof Node) {
      range.setStart(el.childNodes[0], setPoint);
    }
    range.collapse(true);

    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  ngAfterViewInit(): void {
    this.textDiv.nativeElement.innerText = this.value
    this.textDiv?.nativeElement.focus();
  }

  enter(cursorPos: number, nativeElement: any, event: any, index: number) {
    this.store.dispatch(new SplitTextNode(this.groupID, cursorPos, index))//nativeElement.innerText
    event.preventDefault();
  }

  backspace(cursorPos: number, nativeElement: any, event: any, index: number) {
    if (nativeElement.innerText.trim() === '') {
      this.store.dispatch(new DropNode(this.groupID, index))
      event.preventDefault();
    }

    if (nativeElement.innerText.trim() !== '' && cursorPos === 0) {
      this.store.dispatch(new ConcatNodes(this.groupID, index, nativeElement.innerText))
      event.preventDefault();
    }
  }

  up(cursorPos: number, nativeElement: any, event: any, index: number) {
    if (cursorPos === 0) {
      this.store.dispatch(new UpFocusNode(this.groupID, index))
      event.preventDefault();
    }
  }

  down(cursorPos: number, nativeElement: any, event: any, index: number) {
    if (nativeElement.innerText.length === cursorPos) {
      this.store.dispatch(new DownFocusNode(this.groupID, index))
      event.preventDefault();
    }
  }

}
