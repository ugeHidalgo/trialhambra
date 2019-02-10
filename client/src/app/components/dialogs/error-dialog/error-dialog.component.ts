import { Component, ViewChild, Output } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  message: string;
  title: string;

  @ViewChild(ModalDirective) public errorDialog: ModalDirective;
  public isModalShown = false;
  private clickStream = new Subject<boolean>();
  @Output() observable = this.clickStream.asObservable();

  public showModal(title, message): void {
    const me = this;

    me.message = message;
    me.title = title;

    me.errorDialog.show();
    me.isModalShown = true;
  }

  public hideModal(): void {
    const me = this;

    me.clickStream.next(true);
    me.errorDialog.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }

}
