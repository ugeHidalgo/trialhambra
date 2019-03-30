import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(
    private router: Router,
    public toastr: ToastrService,
    private userService: UserService) {
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
      return {onerequired: true}
    }

    control1.setErrors(null);
    control2.setErrors(null);
    return null;
  }

  onResetPassword() {
    const me = this,
          user = new User();
    let sentTo: string = '';

    me.getFormData();
    sentTo = me.setMessageReciever();
    user.username = me.username;
    user.eMail = me.email;

    if (!me.forgotForm.invalid) {
      me.userService.sendUserPasswordRecoverMail(user)
        .subscribe( result => {
          if (result) {
            me.toastr.success(`Hemos enviado un correo a${sentTo} (si existe en nuestra base de datos) para recuperar la contraseña.`);
            me.router.navigate(['/login']);
          } else {
            me.toastr.error('Un problema impidió recuperar la contraseña. Por favor, inténtelo de nuevo.');
          }
      });
    }
  }

  getFormData = (): any => {
    const me = this,
          formModel = me.forgotForm.value;

    me.username = formModel.username;
    me.email = formModel.email;
  }

  setMessageReciever(): string {
    const me = this;

    if (me.username !== ''){
      return `l usuario  ${me.username}`;
    }

    return ` ${me.email}`;
  }

}
