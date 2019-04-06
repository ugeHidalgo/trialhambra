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
      { type: 'required', message: 'El nombre de usuario es necesario.'}
    ],
    'email': [
      { type: 'required', message: 'El correo electrónico del usuario es necesario.'},
      { type: 'email', message: 'Correo electrónico no válido.'}
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
      username: new FormControl ( '', {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      email: new FormControl ( '', {
        validators: Validators.compose ([
          Validators.required, Validators.email
        ]),
        updateOn: 'blur'
      })
    });
  }

  onResetPassword() {
    const me = this,
          user = new User();

    me.getFormData();
    user.username = me.username;
    user.eMail = me.email;

    if (!me.forgotForm.invalid) {
      me.userService.sendUserPasswordRecoverMail(user)
        .subscribe( result => {
          if (result) {
            me.toastr.success(`Hemos enviado un correo a su cuenta(si existe en nuestra base de datos) para recuperar la contraseña.`);
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
}
