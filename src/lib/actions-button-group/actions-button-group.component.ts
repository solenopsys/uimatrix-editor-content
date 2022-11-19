import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActionButton } from "../fui-components.module";



@Component({
    selector: 'fui-actions-button-group',
    templateUrl: './actions-button-group.component.html',
    styleUrls: ['./actions-button-group.component.css']
})
export class ActionsButtonGroupComponent implements OnInit {
    @Input()
    actions!: ActionButton[];

    @Output()
    emmitAction = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }
}
