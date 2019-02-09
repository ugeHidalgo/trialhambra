import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  loading = false;
  validatingForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    vcr: ViewContainerRef ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.createForm();
 }

  ngOnInit() {
  }

  createForm() {
    this.validatingForm = this.fb.group({
      username: [ '', Validators.required ],
      firstname: '',
      lastname: '',
      password: '',
      email: [ '', Validators.email ]
    });
  }

  register() {
    const me = this;

    me.loading = true;
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
}
