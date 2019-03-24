import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  username : string;
  hashedPassword: string;
  password : string;
  password2: string;

  passwordsForm: FormGroup;

  validation_messages = {
    'password': [
      { type: 'required', message: 'La contraseña nueva es obligatoria.'},
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de seis caracteres.'}
    ],
    'password2': [
      { type: 'required', message: 'Es obligatorio reescribir la nueva contraseña.'},
      { type: 'areEqual', message: 'Las contraseñas deben ser iguales'}
    ]
  }

  constructor(private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    const me = this;

    me.username = me.route.snapshot.paramMap.get('u'),
    me.hashedPassword = me.route.snapshot.paramMap.get('p');
    me.password = '';
    me.password2 = '';
  }

  createForm() {
    const me = this;

    me.passwordsForm = new FormGroup({
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
      //Save new password and go to login screen
    }
  }

}
