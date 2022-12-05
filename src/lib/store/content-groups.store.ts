import {Injectable, Injector} from "@angular/core";
import {
  BlockNode, ContentNode,
  ContentNodesGroup,
  DragState,
  FIRST_POSITION,
  LAST_POSITION,

  TextNodeType,
} from "./model";
import {Action, createSelector, Selector, State, StateContext, Store} from "@ngxs/store";
import {append, compose, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {firstValueFrom} from "rxjs";
import {
  ContentNodeState, LoadNodes,
  NewNode,
  RemoveNode,
  RemoveNodes,
  SetFocusNode, SetNotEdited,
  UpdateValueNode
} from "./content-node.store";
import {IdService} from "@solenopsys/lib-globals";
import { ContentService } from "./content.service";
import { FragmentVersionUpdated, UpdateFragment } from "./fragment.store";
import { ContentState, LoadVersion } from "./content.store";


interface ContentGroupModel {
  groups: ContentNodesGroup[];
  dragAndDrop: DragState
}

export class CreateGroup {
  static readonly type = '[ContentGroup] Create UI Group Nodes';

  constructor(public groupID: string, public fragmentID: string) {
  }
}

export class DestroyGroup {
  static readonly type = '[ContentGroup]  Destroy UI Group Nodes';

  constructor(public groupID: string) {
  }
}

export class LoadNodesFromVersion {
  static readonly type = '[ContentGroup] Create Load Nodes From Version';

  constructor(public versionId: string, public groupID: string) {
  }
}

export class SaveNodesToVersionOfFragment {
  static readonly type = '[ContentGroup] Save Nodes To Version';

  constructor(public groupID: string) {
  }
}


export class UpFocusNode {
  static readonly type = '[ContentGroup] Up Focus';

  constructor(public groupID: string, public index: number) {
  }
}

export class DownFocusNode {
  static readonly type = '[ContentGroup] Down Focus';

  constructor(public groupID: string, public index: number) {
  }
}


export class StartDragNode {
  static readonly type = '[ContentGroup] Start Drag';

  constructor(public groupID: string, public index: number) {
  }
}


export class EndDragNode {
  static readonly type = '[ContentGroup] End Drag';

  constructor(public groupID: string, public index: number) {
  }
}

export class OverDragNode {
  static readonly type = '[ContentGroup] Over Drag';

  constructor(public groupID: string, public index: number) {
  }
}

export class NewGroupNode {
  static readonly type = '[ContentGroup] Create New';

  constructor(public groupID: string, public toPosition: number, public text: string, public type: TextNodeType) {
  }
}


export class DropNode {
  static readonly type = '[ContentGroup] Drop Node';

  constructor(public groupID: string, public index: number) {
  }
}

export class EditedGroup {
  static readonly type = '[ContentGroup] Set Edited Flag Of Group';

  constructor(public groupID: string) {
  }
}


export class ConcatNodes {
  static readonly type = '[ContentGroup] Concat Nodes';

  constructor(public groupID: string, public index: number, public data: string) {
  }
}

export class MoveNode {
  static readonly type = '[ContentGroup] Move Node';

  constructor(public fromIndex: number, public fromGroupID: string, public toIndex: number, public toGroupID: string) {
  }
}

export class SplitTextNode {
  static readonly type = '[ContentGroup] Split Text Node';

  constructor(public groupID: string, public cursorPos: number, public index: number) {
  }
}

@State<ContentGroupModel>({
  name: "content_group",
  defaults: {
    groups: [],
    dragAndDrop: {active: false, start: {index: 0, groupID: ""}, moving: {index: 0, groupID: ""}}
  }
})
@Injectable()
export class ContentGroupState {

  constructor(private injector: Injector, private store: Store, private idService: IdService) { //, private co:ContentState
    console.log("IDS", idService)
  }


  @Selector()
  static getDragAndDrop(state: ContentGroupModel) {
    return state.dragAndDrop;
  }

  static getGroupByFID(fid: string) {
    return createSelector([ContentGroupState], (state: ContentGroupModel) => {
      return state.groups.find(item => item.fid === fid);
    });
  }

  @Action(CreateGroup)
  createGroup({getState, setState}: StateContext<ContentGroupModel>, {groupID, fragmentID}: CreateGroup) {
    const newGroup = {fid: groupID, blocks: [], edited: false, fragmentId: fragmentID} as ContentNodesGroup;
    setState(patch({groups: append([newGroup])}))
  }

  @Action(DestroyGroup)
  async deleteGroup({getState, setState}: StateContext<ContentGroupModel>, {groupID}: DestroyGroup) {
    const ids = getState().groups.find(g => g!.fid === groupID)!.blocks;
    setState(
      patch({
        groups: removeItem<ContentNodesGroup>(g => g!.fid === groupID)
      })
    )

    this.store.dispatch(new RemoveNodes(ids));

  }

  @Action(LoadNodesFromVersion)
  async loadVersion({getState, setState}: StateContext<ContentGroupModel>, {versionId, groupID}: LoadNodesFromVersion) {

    let loaded = this.store.selectSnapshot(ContentState.isLoadedVersion(versionId));

    if (!loaded) {
      this.store.dispatch(new LoadVersion(versionId));
    }
    const version = await firstValueFrom(this.store.select(ContentState.getVersionByUID(versionId)));
    const blocksIds: string[] = []
    const forLoadIds: { id: string, backId: string }[] = []
    version?.nodes.forEach(backId => {
        let id = this.idService.getNextId();

        blocksIds.push(id)
        forLoadIds.push({id, backId})
      }
    )

    this.store.dispatch(new LoadNodes(forLoadIds));
    setState(
      patch({
        groups: updateItem(g => g?.fid === groupID, patch<ContentNodesGroup>({
          blocks: blocksIds,
          edited: false
        }))
      })
    )
  }


  @Action(SaveNodesToVersionOfFragment)
  async saveVersion({getState, setState}: StateContext<ContentGroupModel>, {groupID}: SaveNodesToVersionOfFragment) { //todo стоит добавить fromId для истории
    const group = getState().groups.find(g => g?.fid === groupID)

    if (group) {

      const cs = this.injector.get(ContentService); //todo разобраться почему не работает инжектор через конструктор и убрать это
      group.blocks;
      const blocks: ContentNode[] = [];
      const edited: string[] = []
      for (const blockId of group.blocks) {
        const block: BlockNode | undefined = await firstValueFrom(this.store.select(ContentNodeState.getBlockById(blockId)))


        if (block) {


          const node: ContentNode = {
            before: block.edited ? block.uid : block.before,
            uid: block.edited ? "" : block.uid,
            type: block.type,
            value: block.value,
          }
          blocks.push(node);

          if (block.edited) {
            edited.push(block.id)
          }

        }

      }
      cs.newTextVersion({articleId: group.fragmentId, blocks}).then(frag => {
        console.log("SAVED VERSION", frag)

        setState(patch(
          {
            groups: updateItem(
              g => g?.fid === groupID, patch<ContentNodesGroup>({
                edited: false
              })
            )
          }));
        const newVersion: string = frag.uids.textVersion;
        this.store.dispatch(new UpdateFragment(group.fragmentId))
        this.store.dispatch(new FragmentVersionUpdated(group.fragmentId, newVersion))
        this.store.dispatch(new SetNotEdited(edited))
      });


    }


    // this.store.dispatch(new NewNode(id, text, type));

    //todo load version and add to fragment
  }

  @Action(NewGroupNode)
  newNode({getState, setState}: StateContext<ContentGroupModel>, {groupID, toPosition, text, type}: NewGroupNode) { //todo стоит добавить fromId для истории
    let id = this.idService.getNextId();
    setState(patch(
      {
        groups: updateItem(
          g => g?.fid === groupID, patch<ContentNodesGroup>({
            blocks: insertItem(id, toPosition),
            edited: true
          })
        )
      }));

    this.store.dispatch(new NewNode(id, text, type))
  }

  @Action(EditedGroup)
  setEdited({getState, setState}: StateContext<ContentGroupModel>, {groupID}: EditedGroup) {
    setState(patch(
      {
        groups: updateItem(
          g => g?.fid === groupID, patch<ContentNodesGroup>({

            edited: true
          })
        )
      }));
  }


  @Action(DropNode)
  async dropNode({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: DropNode) {

    const beforeNodeId = index - 1;
    const nodeId = getState().groups!.find(g => g.fid === groupID)!.blocks[index];

    setState(patch(
        {
          groups: updateItem(
            g => g?.fid === groupID,
            patch<ContentNodesGroup>({
              blocks: removeItem(index),
              edited: true
            })
          )
        }
      )
    );


    this.store.dispatch(new RemoveNode(nodeId));

    if (index > 0) {
      const beforeId = getState().groups!.find(g => g.fid === groupID)!.blocks[beforeNodeId];
      this.store.dispatch(new SetFocusNode(beforeId, LAST_POSITION));
    }


  }


  @Action(ConcatNodes)
  async concatNodes({getState, setState}: StateContext<ContentGroupModel>, {index, data, groupID}: ConcatNodes) {
    if (index > 0) {
      const group = getState().groups.find(g => g.fid === groupID)

      if (group) {
        const beforeIndex = index - 1;
        const id = group.blocks[index]
        const beforeId = group.blocks[beforeIndex]
        const before: BlockNode | undefined = await firstValueFrom(this.store.select(ContentNodeState.getBlockById(group.blocks[beforeIndex])))
        const cursorPoint = before!.value.length;

        setState(patch({
          groups: updateItem(
            g => g?.fid === groupID,
            patch<ContentNodesGroup>({
              blocks: compose(
                removeItem(index),
              ),
              edited: true
            })
          )
        }))
        await this.store.dispatch(new UpdateValueNode(beforeId, before?.value + data));
        this.store.dispatch(new SetFocusNode(beforeId, cursorPoint));
        this.store.dispatch(new RemoveNode(id));
      }
    }
  }


  @Action(SplitTextNode)
  async splitNode({getState, setState}: StateContext<ContentGroupModel>, {cursorPos, index, groupID}: SplitTextNode) {
    const findFunc = (g: any) => g?.fid === groupID;
    let id = getState().groups.find(findFunc)!.blocks[index];
    const node: BlockNode | undefined = await firstValueFrom(this.store.select(ContentNodeState.getBlockById(id)))

    if (node) {
      const value = node.value
      const first = value.substring(0, cursorPos);
      const second = value.substring(cursorPos);
      const newId = this.idService.getNextId();

      setState(patch({
          groups: updateItem(findFunc, patch({
            blocks: insertItem(newId, index + 1),
            edited: true
          }))
        })
      );

      this.store.dispatch(new UpdateValueNode(id, first))
      this.store.dispatch(new NewNode(newId, second, TextNodeType.PARAGRAPH))
    }
  }

  @Action(UpFocusNode)
  upFocus({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: UpFocusNode) {
    const findFunc = (g: any) => g?.fid === groupID;
    if (index > 0) {
      const beforeIndex = index - 1;
      let id = getState().groups.find(findFunc)!.blocks[beforeIndex];
      this.store.dispatch(new SetFocusNode(id, LAST_POSITION));
    }
  }

  @Action(DownFocusNode)
  downFocus({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: DownFocusNode) {
    const findFunc = (g: any) => g?.fid === groupID;
    if (index < getState().groups.find(findFunc)!.blocks.length - 1) {
      const afterIndex = index + 1;
      let id = getState().groups.find(findFunc)!.blocks[afterIndex];
      this.store.dispatch(new SetFocusNode(id, FIRST_POSITION));
    }
  }


  @Action(MoveNode)
  moveNode({getState, setState}: StateContext<ContentGroupModel>, {
    fromGroupID,
    fromIndex,
    toGroupID,
    toIndex
  }: MoveNode) {
    const fromNode: string = getState().groups.find((g: any) => g?.fid === fromGroupID)!.blocks[fromIndex]

    const remove = updateItem((g: any) => g?.fid === fromGroupID, patch({
      blocks: removeItem(fromIndex),
      edited: true
    }));
    const insert = updateItem((g: any) => g?.fid === toGroupID, patch({
      blocks: insertItem(fromNode, toIndex),
      edited: true
    }));
    setState(
      patch({
          //@ts-ignore
          groups: compose(remove, insert)
        },
      )
    )
  }


  @Action(StartDragNode)
  startDrag({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: StartDragNode) {
    setState(patch({
      dragAndDrop: patch({
        active: true,
        start: {index, groupID}
      })
    }))
  }

  @Action(OverDragNode)
  overDrag({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: OverDragNode) {
    setState(patch({dragAndDrop: patch({active: true, moving: {index: index, groupID}})}))
  }

  @Action(EndDragNode)
  endDrag({getState, setState}: StateContext<ContentGroupModel>, {index, groupID}: EndDragNode) {
    setState(patch({dragAndDrop: patch({active: false})}))
    let toIndex = getState().dragAndDrop.moving.index;

    let isSameGroup = groupID === getState().dragAndDrop.moving.groupID;
    let isNextPosition = index < getState().dragAndDrop.moving.index;
    let isSamePositionForward = index === getState().dragAndDrop.moving.index - 1;
    let correction = 0;
    if ((isSamePositionForward || isNextPosition) && isSameGroup) {
      correction = -1;
    }
    const corrected = toIndex + correction;
    this.store.dispatch(new MoveNode(index, groupID, corrected, getState().dragAndDrop.moving.groupID));
  }

}


