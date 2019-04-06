import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  myUserService: UserService;
  user: User = new User();
  loading = false;
  validatingForm: FormGroup;
  submitted = false;
  validation_messages = {
    'username': [
      { type: 'required', message: 'El nombre de usuario es obligatorio.'},
      { type: 'isUsedUsername', message: 'Este nombre de usuario ya está en uso.'}
    ],
    'email': [
      { type: 'required', message: 'El correo electrónico es obligatorio.'},
      { type: 'email', message: 'Correo electrónico no válido.'}
    ],
    'password': [
      { type: 'required', message: 'La contraseña nueva es obligatoria.'},
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de seis caracteres.'}
    ],
    'password2': [
      { type: 'required', message: 'Es obligatorio reescribir la nueva contraseña.'},
      { type: 'shouldMatch', message: 'Las contraseñas deben ser iguales'}
    ]
  }

  constructor(
    private router: Router,
    private userService: UserService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    vcr: ViewContainerRef ) {
      this.myUserService = userService;
      this.createForm();
 }

  ngOnInit() {
  }

  createForm() {
    const me = this;

    me.validatingForm = new FormGroup({
      username: new FormControl ('', {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      firstname: new FormControl (''),
      lastname: new FormControl(''),
      password: new FormControl('', {
        validators: Validators.compose ([
          Validators.required,
          Validators.minLength(6)
        ]),
        updateOn: 'blur'
      }),
      password2: new FormControl('',{ updateOn: 'blur'}),
      email: new FormControl('', {
        validators: Validators.compose ([
          Validators.required,
          Validators.email
        ]),
        updateOn: 'blur'
      }),
    }, Validators.compose ([
        (formGroup: any) => {
          return me.shouldMatch(formGroup, 'password', 'password2');
        },
        (formGroup: any) => {
          return me.isUsedUsername(formGroup, me.myUserService, 'username');
        }
      ])
    );
  }

  register() {
    const me = this;

    me.loading = true;
    me.submitted = true;
    me.user = this.getFormData();

    if (this.validatingForm.invalid) {
        return;
    }

    me.userService.registerUser(me.user)
      .subscribe(
        newUserAdded => {
          me.toastr.success(`User ${newUserAdded.username} was successfully added.`);
          me.router.navigate(['/login']);
        },
        error => {
          me.toastr.error(error.error);
          me.loading = false;
        }
      );
  }

  getFormData(): User {
    const me = this,
          formModel = me.validatingForm.value,
          newUser: User = me.user;

    newUser.username = formModel.username;
    newUser.firstName = formModel.firstname;
    newUser.lastName = formModel.lastname;
    newUser.eMail = formModel.email;
    newUser.password = formModel.password;

    return newUser;
  }

  isUsedUsername (formGroup: FormGroup, userService: UserService, controlName: string): {[key: string]: boolean} {
    const control = formGroup.controls[controlName];
    let username = '';

    if (control.errors && !control.errors.isUsedUsername) {
      return;
    }

    username = control.value

    userService.isExistingUsername(username)
      .subscribe(isExistingUsername => {
        if (isExistingUsername) {
          control.setErrors( {isUsedUsername: true});
          return {isUsedUsername: true}
        } else {
          control.setErrors(null);
          return null
        }
      });
  }

  shouldMatch(formGroup: FormGroup, controlName1: string, controlName2: string): {[key: string]: boolean} {
    const control1 = formGroup.controls[controlName1],
          control2 = formGroup.controls[controlName2];

    if (control1.errors) {
      return;
    }

    if (control2.errors && !control2.errors.shouldMatch) {
      return;
    }

    if (control1.value !== control2.value) {
      control2.setErrors( {shouldMatch: true});
      return {shouldMatch: true};
    } else {
      control2.setErrors(null);
      return null;
    }
  }
}
