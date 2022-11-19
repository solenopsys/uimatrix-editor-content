
import {Observable} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import { FreeProvider, IdTitle } from "../free-select/free-select.component";


export enum Direction {
    in = 'in',
    out = 'out'
}

export enum ItemType {
    process = 'process',
    resource = 'resource'
}


export interface ItemLink {
    id: string;
    count: number;
}

export interface ItemAbstract {
    id: string;
    title: string;
    goals?: string[];
    in?: ItemLink[];
    out?: ItemLink[];
}


export interface ProcessData extends ItemAbstract {
    term?: number;
}

export interface ResourceData extends ItemAbstract {
    x?: number;
}


export class FilterObservableProvider implements FreeProvider {

    constructor(private resourcesAll$: Observable<ResourceData[]>) {
    }

    initFilterSelector(str: Observable<string>): Observable<IdTitle[]> {
        return str.pipe(withLatestFrom(this.resourcesAll$)).pipe(map(([query, items]) => {
            return items.filter(item => {
                return query === '' || item.title.indexOf(query) >= 0;
            });
        }));
    }
}



