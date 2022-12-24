import {Component, EventEmitter, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {filter, firstValueFrom, Observable} from "rxjs";
import {FilterCachedProvider, ItemAbstract} from "@solenopsys/uimatrix-controls";

import {ArticleVersion} from "@solenopsys/lib-dgraph";
import {ContentService} from "../store/content.service";
import {IdService} from "@solenopsys/lib-globals";
import {
  ContentGroupState,
  CreateGroup,
  LoadNodesFromVersion,
  SaveNodesToVersionOfFragment
} from "../store/content-groups.store";
import {Store} from "@ngxs/store";
import {ContentState, LoadVersion} from "../store/content.store";
import {ContentNodesGroup} from "../store/model";

@Component({
  selector: 'ui-paragraph-move',
  templateUrl: './paragraph-move.component.html',
  styleUrls: ['./paragraph-move.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ParagraphMoveComponent implements OnInit {

  value$: Observable<ItemAbstract> | undefined;

  newText!: string;


  value!: any;

  groupId;

  valueChange = new EventEmitter<any>();
  nodesGroup$!: Observable<ContentNodesGroup | undefined>
  fragmentId: any | undefined

  conf: any | undefined


  provider!: FilterCachedProvider;

  constructor(idService: IdService, private textService: ContentService, private store: Store) {
    this.groupId = idService.getNextId()

    this.nodesGroup$ = this.store.select(ContentGroupState.getGroupByFID(this.groupId));
  }

  ngOnInit(): void {
    // @ts-ignore
    this.provider = new FilterCachedProvider((o: any) => {
      return {id: o.uid, title: o.fragment};
    });
    this.textService.loadFragments().then(data => {
        this.provider.setData(data.results);
      }
    )
  }

  async entitySelect($event: any) {
    this.valueChange.emit(this.value);
    this.fragmentId = $event.id;
    const res: any = await firstValueFrom(this.textService.loadFragmentConf(this.fragmentId))
    if (res.lastVersionId) {
      this.store.dispatch(new CreateGroup(this.groupId, this.fragmentId));
      this.loadBlocks(res.lastVersionId);
    }
  }

  async loadBlocks(versionId: string) { //todo убрать дублирование этой функции
    const loaded = this.store.selectSnapshot(ContentState.isLoadedVersion(versionId))
    if (!loaded) {
      this.store.dispatch(new LoadVersion(versionId));
    }

    let version$ = this.store.select(ContentState.getVersionByUID(versionId));
    const sub = version$.pipe(filter(item => item !== undefined)).subscribe((v) => {
        this.store.dispatch(new LoadNodesFromVersion(v!.uid, this.groupId))
      }
    )
    //this.subs.push(sub);
  }


  textChanged(text: string) {
    this.newText = text;
  }

  print($event: ArticleVersion) {

  }

  saveValues() {
    this.store.dispatch(new SaveNodesToVersionOfFragment(this.groupId));
  }
}
