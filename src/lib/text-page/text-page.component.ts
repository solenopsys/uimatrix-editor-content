import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DgraphService} from "@solenopsys/lib-dgraph";
import {firstValueFrom, map, Observable} from "rxjs";
import {ContentNode} from "../store/model";

@Component({
  selector: 'ui-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.css']
})
export class TextPageComponent implements OnInit {



  blocks: ContentNode[] | undefined;


  readonly blocks$ = this.activatedroute.data.pipe(
    map((data: any) => data.blocks)
  );

  constructor(private activatedroute: ActivatedRoute) {
  }


  ngOnInit(): void {
  }
}


@Injectable({providedIn: 'root'})
export class TextBlockResolver implements Resolve<ContentNode[]> {
  constructor(private dgraph: DgraphService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ContentNode[]> {
    let data:any = route.data;
    let id = data.uid
    return new Promise(resolve => {
      firstValueFrom(this.dgraph.query(`{ results   (func: uid(${id})  )
    {uid fragment  versions  (orderdesc: version_date,first: 1)
    {uid   version_date blocks @facets(orderasc: ord)  {uid type   value before } }    }  }`)
        ).then((res:any) => { // todo убрать дублирование и вынести в сервис
          resolve(res.results[0].versions[0].blocks);
        }
      );
    })

  }
}

