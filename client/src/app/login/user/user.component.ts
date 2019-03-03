import { Component, OnInit, HostBinding, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Location, DatePipe } from '@angular/common';
import { slideInDownAnimation } from '../../animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  passwordsGroup: FormGroup;
  hidePasswordFields: boolean;

  validation_messages = {
    'oldPassword': [
      { type: 'required', message: 'La contraseña actual es obligatoria.'}
    ],
    'password': [
      { type: 'required', message: 'La contraseña nueva es obligatoria.'},
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de seis caracteres.'}
    ],
    'password2': [
      { type: 'required', message: 'Es obligatorio reescribir la nueva contraseña.'},
      { type: 'areEqual', message: 'Las contraseñas deben ser iguales'}
    ]
  }

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

    me.passwordsGroup = new FormGroup({
      oldPassword: new FormControl ( '',  {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      password: new FormControl ( '', {
        validators: Validators.compose([
          Validators.required,
          Validators.minLength(6)]),
        updateOn: 'blur'
      }),
      password2: new FormControl ( '', {
        validators: Validators.required,
        updateOn: 'blur'
      })
    }, (formGroup: FormGroup) => {
      return this.areEqual(formGroup, "password", "password2")
    });

    me.validatingForm = this.fb.group({
      firstName: new FormControl ('' , {}),
      lastName: new FormControl ('' , {}),
      eMail: new FormControl ('' , {}),
      birthDate: new FormControl ('' , {}),
      created: new FormControl ('' , {}),
      updated: new FormControl ('' , {}),
      active: new FormControl ('' , {}),
      admin: new FormControl ('' , {}),
      phone: new FormControl ('' , {}),
      mobile: new FormControl ('' , {}),
      passwordsGroup: me.passwordsGroup
    });
  }

  rebuildForm() {
    const me = this,
          datePipe = new DatePipe(navigator.language),
          format = 'dd/MM/yyyy';

    me.passwordsGroup.reset({
      oldPassword: '',
      password: me.user.password,
      password2: '',
    });

    me.validatingForm.reset({
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

  areEqual(formGroup: FormGroup, controlName1: string, controlName2: string) {
    const control1 = formGroup.controls[controlName1],
          control2 = formGroup.controls[controlName2];

    if (!control1.pristine && control1.errors) {
      return;
    }

    if (!control2.pristine && control2.errors && !control2.errors.areEqual) {
      return;
    }

    if (control1.value !== control2.value) {
      control2.setErrors( {areEqual: true});
      return {areEqual: true}
    } else {
      control2.setErrors(null);
      return null;
    }
  }
}
