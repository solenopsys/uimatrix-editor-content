
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ui-text-type-selector',
  templateUrl: './text-type-selector.component.html',
  styleUrls: ['./text-type-selector.component.css']
})
export class TextTypeSelectorComponent implements OnInit {

  @Input()
  type!: string;

  @Output()
  typeChange = new EventEmitter();

  showMenu = false;
  public iconsMap: { [key: string]: string } = {
    PARAGRAPH: '/assets/icons/01-Interface-Essential/37-Paragraphs/paragraph.svg',
    HEADER1: '/assets/icons/01-Interface-Essential/51-Paginate/paginate-filter-1.svg',
    HEADER2: '/assets/icons/01-Interface-Essential/51-Paginate/paginate-filter-2.svg',
    HEADER3: '/assets/icons/01-Interface-Essential/51-Paginate/paginate-filter-3.svg',
    IMAGE: '/assets/icons/01-Interface-Essential/51-Paginate/paginate-filter-picture.svg',
    CODE: '/assets/icons/01-Interface-Essential/51-Paginate/paginate-filter-text.svg'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  select(key: string) {
    this.type = key;
    this.typeChange.next(this.type);
  }
}
