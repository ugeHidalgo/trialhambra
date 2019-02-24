import { Component, OnInit, HostBinding, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Location, DatePipe } from '@angular/common';
import { slideInDownAnimation } from '../../animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ComponentCanDeactivate } from '../../guards/pending-changes.guard';

import { User } from '../../models/user.model';
import { GlobalsService } from '../../globals/globals.service';
import { UserService } from '../../services/user/user.service';

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
  hidePasswordFields: boolean;

  constructor(
    private location: Location,
    protected globals: GlobalsService,
    private userService: UserService,
    private fb: FormBuilder,
    public toastr: ToastrService) {
      const me = this;
      me.createForm();
  }

  ngOnInit() {
    const me = this;
    me.username = me.globals.userNameLogged;
    me.getLoggedUser(me.username);
    me.hidePasswordFields = true;
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.validatingForm.pristine;
  }

  // Buttons actions
  onClickRefresh() {
    const me = this;

    me.rebuildForm();
    me.hidePasswordFields = true;
  }

  onClickChangePassword() {
    this.hidePasswordFields = false;
  }

  onClickSave(): void {
    const me = this;

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
      oldPassword: '',
      password: ['', Validators.required ],
      password2: '',
      firstName: '',
      lastName: '',
      eMail: '',
      birthDate: '',
      created: '',
      updated: '',
      active: '',
      admin: '',
      phone: '',
      mobile: ''
    });
  }

  rebuildForm() {
    const me = this,
          datePipe = new DatePipe(navigator.language),
          format = 'dd/MM/yyyy';

    me.validatingForm.reset({
      password: me.user.password,
      firstName: me.user.firstName,
      lastName: me.user.lastName,
      eMail: me.user.eMail,
      birthDate: datePipe.transform(me.user.birthDate, format),
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

    newUser.password = formModel.password;
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
