import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  username: string = "";
  email: string = "";

  validation_messages = {
    'username': [
      { type: 'onerequired', message: 'Debe introducir al menos un username o un email.'}
    ],
    'email': [
      { type: 'onerequired', message: 'Debe introducir al menos un username o un email.'}
    ]
  }

  ngOnInit() {
    this.username = "";
    this.email = "";
  }

  constructor() {
    this.createForm();
  }

  createForm() {
    const me = this;

    me.forgotForm = new FormGroup({
      username: new FormControl ( '', {}),
      email: new FormControl ( '', {})
    }, (formGroup: FormGroup) => {
      return this.oneAtLeastEntered(formGroup, "username", "email")
    });
  }

  oneAtLeastEntered(formGroup: FormGroup, controlName1: string, controlName2: string) {
    const control1 = formGroup.controls[controlName1],
          control2 = formGroup.controls[controlName2];

    if (control1.value === "" && control2.value === "") {
      control1.setErrors( {onerequired: true});
      control2.setErrors( {onerequired: true});
      return {onerequiredareEqual: true}
    }

    control1.setErrors(null);
    control2.setErrors(null);
    return null;
  }

  onResetPassword() {
    const me = this;

    if (!me.forgotForm.invalid) {
    }
  }

}
