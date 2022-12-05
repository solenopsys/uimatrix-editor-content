import {Injectable} from "@angular/core";
import {ContentService} from "./content.service";
import {Action, createSelector, State, StateContext} from "@ngxs/store";
import {firstValueFrom} from "rxjs";

import {append, patch, updateItem} from "@ngxs/store/operators";
import { Fragment } from "./model";


export class FragmentsStateModel {
  fragments!: Fragment[];
  loaded!: string[];
}

export class LoadFragment {
  static readonly type = '[TextFragment] Load';

  constructor(public fragmentId: string) {
  }
}

export class UpdateFragment {
  static readonly type = '[TextFragment] Update';

  constructor(public fragmentId: string) {
  }
}

export class FragmentVersionUpdated {
  static readonly type = '[TextFragment] Version Updated';

  constructor(public fragmentId: string, public versionId: string) {
  }
}


@State<FragmentsStateModel>({
  name: "fragment",
  defaults: {
    fragments: [],
    loaded: [],
  }
})
@Injectable()
export class FragmentState {
  constructor(private textEditorService: ContentService) {
  }

  static getById(id: string) {
    return createSelector([FragmentState], (state: FragmentsStateModel) => {
      return state.fragments.find(item => item.uid === id);
    });
  }

  static isLoadedId(id: string) {
    return createSelector([FragmentState], (state: FragmentsStateModel) => {
      return state.loaded.find(item => item === id) !== undefined;
    });
  }

  @Action(LoadFragment)
  async loadFragment({getState, setState}: StateContext<FragmentsStateModel>, {fragmentId}: LoadFragment) {
    const fragment = await firstValueFrom(this.textEditorService.loadFragmentConf(fragmentId))
    setState(patch(
      {
        fragments: append([fragment]),
        loaded: append([fragmentId])
      }))
  }


  @Action(UpdateFragment)
  async updateFragment({getState, setState}: StateContext<FragmentsStateModel>, {fragmentId}: UpdateFragment) {
    const fragment = await firstValueFrom(this.textEditorService.loadFragmentConf(fragmentId))
    setState(patch(
      {
        fragments: updateItem<Fragment>(f => f?.uid === fragmentId, fragment)
      }))
  }


}
