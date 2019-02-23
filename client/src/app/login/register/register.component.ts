import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  user: User = new User();
  loading = false;
  validatingForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private userService: UserService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    vcr: ViewContainerRef ) {
    this.createForm();
 }

  ngOnInit() {
  }

  createForm() {
    const me = this;

    me.validatingForm = me.fb.group({
      username: [ '', Validators.required ],
      firstname: '',
      lastname: '',
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: '',
      email: [ '', [Validators.required, Validators.email]]
    }, {
      validator: me.shouldMatch('password', 'password2')
  });
  }

  register() {
    const me = this;

    me.loading = true;
    me.submitted = true;

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

  shouldMatch(controlName1: string, controlName2: string) {
    return (formGroup: FormGroup) => {
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
      } else {
        control2.setErrors(null);
      }
    }
  }
}
