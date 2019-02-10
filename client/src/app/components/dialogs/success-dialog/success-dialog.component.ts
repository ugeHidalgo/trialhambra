import { Component, ViewChild, Output } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {

  message: string;
  title: string;

  @ViewChild(ModalDirective) public successDialog: ModalDirective;
  public isModalShown = false;
  private clickStream = new Subject<boolean>();
  @Output() observable = this.clickStream.asObservable();

  public showModal(title, message): void {
    const me = this;

    me.message = message;
    me.title = title;

    me.successDialog.show();
    me.isModalShown = true;
  }

  public hideModal(): void {
    const me = this;

    me.clickStream.next(true);
    me.successDialog.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }

}
