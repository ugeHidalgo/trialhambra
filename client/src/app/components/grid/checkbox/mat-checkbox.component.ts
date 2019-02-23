import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-checkbox-cell',
    template: `
        <mat-checkbox [ngModel]="checked" disabled="disabled"></mat-checkbox>
    `,
    styles: [
        `
        :host ::ng-deep .mat-checkbox-layout {
            width: 100%;
            display: inline-block !important;
            text-align: center;
            margin-top: -4px;
        }`
    ]
})
export class MatCheckboxComponent implements ICellRendererAngularComp {
    private params: any;

    private checked = false;

    agInit(params: any): void {
        this.params = params;
        this.checked = this.params.data.active;
    }

    // demonstrates how you can do "inline" editing of a cell
    onChange(checked: boolean) {
        this.checked = checked;
        this.params.node.setDataValue(this.params.colDef, this.checked ? 'On' : 'Off');
    }

    refresh(params: any): boolean {
        return false;
    }
}
