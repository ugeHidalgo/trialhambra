import { Component, ViewChild } from '@angular/core';
import { MDBModalRef, ModalDirective } from 'angular-bootstrap-md';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  @ViewChild('passwordDialog') passwordDialog: ModalDirective;

  passwordsForm: FormGroup;
  action: Subject<any> = new Subject();

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

  constructor(public modalRef: MDBModalRef) {
    this.createForm();
  }

  createForm() {
    const me = this;

    me.passwordsForm = new FormGroup({
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

  onChangePassword() {
    const me = this;

    if (!me.passwordsForm.invalid) {
      me.action.next(me.passwordsForm.value.password);
    }
  }
}
