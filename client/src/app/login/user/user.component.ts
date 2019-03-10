import { Component, OnInit, HostBinding, OnChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { slideInDownAnimation } from '../../animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ComponentCanDeactivate } from '../../guards/pending-changes.guard';

import { User } from '../../models/user.model';
import { GlobalsService } from '../../globals/globals.service';
import { UserService } from '../../services/user/user.service';
import { PasswordComponent } from '../password/password.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [ slideInDownAnimation ]
})

export class UserComponent implements OnInit, OnChanges, ComponentCanDeactivate {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'relative';

  user: User;
  username: string;
  validatingForm: FormGroup;
  passwordDialogRef: MDBModalRef;

  constructor(
    protected globals: GlobalsService,
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: MDBModalService,
    public toastr: ToastrService) {
      this.createForm();
  }

  ngOnInit() {
    const me = this;
    me.username = me.globals.userNameLogged;
    me.getLoggedUser(me.username);
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.validatingForm.pristine;
  }

  // Buttons actions
  onClickRefresh() {
    this.rebuildForm();
  }

  onClickChangePassword() {
    const me = this,
          modalOptions = {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdropClick: false,
            class: '',
            containerClass: '',
            animated: true,
            data: {
                user: me.user
            }
          };
    me.passwordDialogRef = me.modalService.show(PasswordComponent, modalOptions);
    me.passwordDialogRef.content.action.subscribe(
      (newPassword: any) => {
        console.log(newPassword);
        me.passwordDialogRef.hide();
      }
    );
  }

  onClickSave(): void {
    const me = this;

    if (me.validatingForm.invalid) return;

    me.user = this.getFormData();
    me.userService.updateUser(me.user)
      .subscribe( () => {
          me.toastr.success('Successfully saved.');
        }
      );
    me.rebuildForm();
  }

  // FormModel Methods
  createForm() {
    const me = this;

    me.validatingForm = me.fb.group({
      firstName: new FormControl ('' , {}),
      lastName: new FormControl ('' , {}),
      eMail: new FormControl ('' , {}),
      birthDate: new FormControl ('' , {}),
      created: new FormControl ('' , {}),
      updated: new FormControl ('' , {}),
      active: new FormControl ('' , {}),
      admin: new FormControl ('' , {}),
      phone: new FormControl ('' , {}),
      mobile: new FormControl ('' , {})
    });
  }

  rebuildForm() {
    const me = this,
          datePipe = new DatePipe(navigator.language),
          format = 'dd/MM/yyyy';

    me.validatingForm.reset({
      firstName: me.user.firstName,
      lastName: me.user.lastName,
      eMail: me.user.eMail,
      birthDate: me.user.birthDate,
      created: datePipe.transform(me.user.created, format),
      updated: datePipe.transform(me.user.updated, format),
      active: me.user.active,
      admin: me.user.admin,
      phone: me.user.phone,
      mobile: me.user.mobile
    });
  }

  getFormData(): User {
    const me = this,
          formModel = me.validatingForm.value,
          newUser: User = me.user;

    newUser.password = '';
    newUser.firstName = formModel.firstName;
    newUser.lastName = formModel.lastName;
    newUser.eMail = formModel.eMail;
    newUser.birthDate = formModel.birthDate;
    newUser.created = formModel.created;
    newUser.updated = formModel.updated;
    newUser.active = formModel.active;
    newUser.admin = formModel.admin;
    newUser.phone = formModel.phone;
    newUser.mobile = formModel.mobile;

    return newUser;
  }

  // Private methods
  getLoggedUser(username) {
    const me = this;

    me.userService.getUser(username)
      .subscribe( user => {
          me.user = user;
          me.rebuildForm();
      });
  }
}
