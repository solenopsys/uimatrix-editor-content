
import {Action, createSelector, Selector, State, StateContext, Store} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {append, compose, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {firstValueFrom, map} from "rxjs";
import { BlockNode, TextNodeType } from "./model";
import { ContentState } from "./content.store";


interface ContentNodeModel {
  nodes: { [key: string]: BlockNode };
}

export class SetFocusNode {//ok
  static readonly type = '[ContentNode] Set Focus';

  constructor(public id: string, public point: number) {
  }
}

export class UpdateValueNode { //ok
  static readonly type = '[ContentNode] Update Value';

  constructor(public id: string, public value: string) {
  }
}

export class LoadNodes {
  static readonly type = '[ContentNode] Load Nodes';

  constructor(public items: { id: string, backId: string }[]) {
  }
}

export class NewNode {
  static readonly type = '[ContentNode] Create New';

  constructor(public id: string, public text: string, public type: TextNodeType) {
  }
}

export class RemoveNode {
  static readonly type = '[ContentNode] Remove Node';

  constructor(public id: string) {
  }
}

export class RemoveNodes {
  static readonly type = '[ContentNode] Remove Nodes';

  constructor(public ids: string[]) {
  }
}

export class TypeChangeNode { //ok
  static readonly type = '[ContentNode] Type Change';

  constructor(public id: string, public type: TextNodeType) {
  }
}

export class SetNotEdited { //ok
  static readonly type = '[ContentNode] Set Not Edited Blocks';

  constructor(public ids: string[]) {
  }
}


@State<ContentNodeModel>({
  name: "content_node",
  defaults: {
    nodes: {},
  }
})
@Injectable()
export class ContentNodeState {

  constructor(private store: Store) {
  }

 // @Selector()
  static getBlockById(id: string) {
    return createSelector([ContentNodeState], (state: ContentNodeModel) => {
      return state.nodes[id];
    });
  }

  @Action(UpdateValueNode)
  updateValue({getState, setState}: StateContext<ContentNodeModel>, {id, value}: UpdateValueNode) {
    setState(patch({
      nodes: patch<BlockNode>({[id]: patch({value: value, edited: true})})
    }));
  }

  @Action(TypeChangeNode)
  typeChange({getState, setState}: StateContext<ContentNodeModel>, {id, type}: TypeChangeNode) {
    setState(patch({nodes: patch<BlockNode>({[id]: patch({type})})}));
  }

  @Action(SetNotEdited)
  setNotEdited({getState, setState}: StateContext<ContentNodeModel>, {ids}: SetNotEdited) {
    const pids = ids.map(id => {
      return patch({[id]: patch<BlockNode>({edited: false})})
    });
    setState(patch({nodes: compose(...pids)}));
  }


  @Action(LoadNodes)
  async loadNodes({getState, setState}: StateContext<ContentNodeModel>, {items}: LoadNodes) {
    console.log("NODES0", items)
    const o: any = {}
    items.forEach(item => o[item.backId] = item.id)
    console.log("NODES4", o)

    const nodes = await firstValueFrom(this.store.select(ContentState.getNodesByUID(Object.keys(o))));
    console.log("NODES1", nodes)
    let transformed = nodes.map((fromNode: any) => {
      const n = {
        before: fromNode!.before!,
        uid: fromNode!.uid!,
        type: fromNode!.type,
        value: fromNode!.value,
        id: o[fromNode.uid],
        edited: false
      }

      return n
    });
    console.log("NODES1", transformed)

    const apply = transformed.map((node:any) => {
      return patch({[node.id]: node})
    })

    setState(patch({nodes: compose(...apply)}));
  }

  @Action(NewNode)
  newNode({getState, setState}: StateContext<ContentNodeModel>, {id, type, text}: NewNode) {
    const newValue: BlockNode = {type, value: text, edited: true, id}
    setState(patch({nodes: patch<BlockNode>({[id]: newValue})}));
  }

  @Action(RemoveNode)
  async removeNode({getState, setState}: StateContext<ContentNodeModel>, {id}: RemoveNode) {
    setState(patch(
      {nodes: patch<BlockNode>({[id]: undefined})}
    ));
  }

  @Action(RemoveNodes)
  async removeNodes({getState, setState}: StateContext<ContentNodeModel>, {ids}: RemoveNodes) {
    const filtered = Object.keys(getState().nodes)
      .filter(key => ids.indexOf(key) != -1)
      .reduce((obj: any, key) => {
        obj[key] = getState().nodes[key];
        return obj;
      }, {});

    setState(patch({nodes: filtered}));
  }
}
