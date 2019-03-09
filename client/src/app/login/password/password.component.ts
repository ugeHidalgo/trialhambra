import { Component, ViewChild } from '@angular/core';
import { MDBModalRef, ModalDirective } from 'angular-bootstrap-md';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  @ViewChild('passwordDialog') passwordDialog: ModalDirective;

  constructor(public modalRef: MDBModalRef) {}

  save() {
    console.log('saving');
  }
}
