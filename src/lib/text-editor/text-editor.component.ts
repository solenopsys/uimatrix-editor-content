import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {filter, Observable, Subscription} from "rxjs";
import {ContentNodesGroup, Fragment} from "../store/model";
import {FragmentState, FragmentVersionUpdated, LoadFragment} from "../store/fragment.store";
import {ContentState, LoadVersion} from "../store/content.store";
import {Navigate} from "@ngxs/router-plugin";
import {
  ContentGroupState,
  CreateGroup,
  DestroyGroup,
  LoadNodesFromVersion,
  SaveNodesToVersionOfFragment
} from "../store/content-groups.store";
import {IdService} from "@solenopsys/lib-globals";

@Component({
  selector: 'fui-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  fragmentId!: string;
  versionId!: string;

  nodesGroup$!: Observable<ContentNodesGroup | undefined>
  fragment$: Observable<Fragment | undefined> | undefined;
  private subs: Subscription  [] = [];

  groupId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
    private idService: IdService,
    private actions$: Actions) {
    this.groupId = idService.getNextId();

    this.nodesGroup$ = this.store.select(ContentGroupState.getGroupByFID(this.groupId));
  }

  ngOnDestroy(): void {
    this.subs?.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new DestroyGroup(this.groupId));
  }

  ngOnInit(): void {
    this.store.dispatch(new CreateGroup(this.groupId, this.fragmentId));
    this.route.params.subscribe((params: any) => {
      this.versionId = params.version;
      if (this.versionId) {
        this.loadBlocks(this.versionId);
      }
    });

    this.actions$.pipe(ofActionSuccessful(FragmentVersionUpdated)).pipe(filter((action: FragmentVersionUpdated) => { //todo отписку
        return action.fragmentId === this.fragmentId
      }
    )).subscribe(value => {
      // this.selectVersion(value.fragmentId, value.versionId);
      this.location.replaceState(`/content/fragments/${value.fragmentId}/editor/${value.versionId}`);
      this.versionId = value.versionId;

    });
  }

  selectVersion(fragmentId: string, versionId: string) {
    this.store.dispatch(new Navigate(["/content/fragments/", fragmentId,"editor", versionId]));
  }

  @Input('fragmentId')
  set setFragmentId(fragmentId: string) {
    console.log("FRAGMENT SET ",fragmentId)
    this.fragmentId = fragmentId;
    this.fragment$ = this.store.select(FragmentState.getById(this.fragmentId));
    this.loadFragmentItem(fragmentId)

    this.subs.push(this.fragment$.subscribe(fragment => {
      console.log("LOAD ",fragmentId)
      if (fragment?.lastVersionId) {
        if (!this.versionId) {
          this.selectVersion(fragmentId, fragment.lastVersionId);
        }
      }
    }));
  }

  async loadBlocks(versionId: string) {
    const loaded = this.store.selectSnapshot(ContentState.isLoadedVersion(versionId))
    if (!loaded) {
      this.store.dispatch(new LoadVersion(versionId));
    }

    let version$ = this.store.select(ContentState.getVersionByUID(versionId));
    const sub = version$.pipe(filter(item => item !== undefined)).subscribe((v) => {
        this.store.dispatch(new LoadNodesFromVersion(v!.uid, this.groupId))
      }
    )
    this.subs.push(sub);
  }

  async loadFragmentItem(fragmentId: string) {
    const loaded = this.store.selectSnapshot(FragmentState.isLoadedId(fragmentId))
    if (!loaded) {
      this.store.dispatch(new LoadFragment(fragmentId));
    }
  }


  saveValues() {
    this.store.dispatch(new SaveNodesToVersionOfFragment(this.groupId));
  }
}
