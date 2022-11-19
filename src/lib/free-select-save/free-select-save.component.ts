import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {FilterCachedProvider, FreeProvider, FreeSelectComponent, IdTitle} from '../free-select/free-select.component';

@Component({
    selector: 'fui-free-select-save',
    templateUrl: './free-select-save.component.html',
    styleUrls: ['./free-select-save.component.css']
})
export class FreeSelectSaveComponent {
    @Output()
    save = new EventEmitter<string>();

    @Input()
    dataProvider!: FreeProvider;

    @Input()
    value!:any;

    @Output()
    newSelect = new EventEmitter<boolean>();

    @Output()
    valueChange = new EventEmitter<any>();

    newText!: string;

    showSave = false;

    textChanged(text: string) {
        this.showSave = text !== '';
        this.newSelect.emit(false);
        this.newText = text;
    }

    entitySelect($event: any) {
        this.showSave = false;
        this.newSelect.emit(true);
        this.valueChange.emit(this.value);
    }

    saveNew(newText: string) {
        this.showSave = false;
        this.save.emit(newText);
        this.newSelect.emit(false);
    }
}


