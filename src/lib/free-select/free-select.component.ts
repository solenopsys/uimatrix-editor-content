import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';


export interface IdTitle {
  title: string;
  id: string;
}

export interface FreeProvider {
  initFilterSelector(str: Observable<string>): Observable<IdTitle[]>;
}


export class FilterCachedProvider implements FreeProvider {
  private transformedArray!: IdTitle[];

  constructor(private transformFunction: () => any) {
  }

  setData(dataArray: any[]) {
    this.transformedArray = dataArray.map(this.transformFunction);
  }

  initFilterSelector(str: Observable<string>): Observable<IdTitle[]> {
    const sub = new Subject<IdTitle[]>();
    str.pipe().subscribe(query => {
      sub.next(this.transformedArray.filter((s) => {
        return query === '' || s.title.indexOf(query) >= 0;
      }));
    });
    return sub.asObservable();
  }
}

@Component({
  selector: 'fui-free-select',
  templateUrl: './free-select.component.html',
  styleUrls: ['./free-select.component.css']
})
export class FreeSelectComponent implements OnInit, OnDestroy {


  text!: string;

  @Output()
  textChange = new EventEmitter();

  filteredEntities!: Observable<IdTitle[]>;


  dataProvider!: FreeProvider;


  value!: IdTitle;

  strObservable = new Subject<any>();

  @Output()
  public valueChange = new EventEmitter();


  visible = false;

  constructor() {
  }

  ngOnInit(): void {

  }

  @Input('dataProvider')
  set setDataProvider(dataProvider: FreeProvider) {// todo   warning
    if (dataProvider) {
      this.dataProvider = dataProvider;
      this.filteredEntities = this.dataProvider.initFilterSelector(this.strObservable.asObservable());
      this.strObservable.asObservable().subscribe(z => this.visible = true);
    }
  }

  ngOnDestroy(): void {
    this.strObservable.unsubscribe();
  }

  @Input('value')
  set setValue(value: any) {
    this.showChanges(value);
  }

  showChanges(entity: IdTitle) {
    this.value = entity;
    this.text = this.value?.title;
    this.visible = false;
  }

  selectEntity(entity: IdTitle) {
    this.showChanges(entity);

    this.valueChange.emit(this.value);
  }
}


