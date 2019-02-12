import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user/user.service';
import { GlobalsService } from '../../globals/globals.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  model: any = {};
  angular: any;
  loading = false;

  constructor(
    private router: Router,
    protected globals: GlobalsService,
    private userService: UserService,
    private toastr: ToastrService ) {
  }

  onLogin() {
    const me = this;

    me.loading = true;
    me.userService.isUserAuthenticated(me.model)
      .subscribe(
        data => {
          me.globals.setUser(me.model.userName);
          me.globals.storeUserDataInLocalStorage(me.model.userName, data.token);
          me.router.navigate(['/dashboard']);
        },
        error => {
          me.toastr.error(error.error);
          me.loading = false;
          me.globals.clearUser();
        }
      );
  }
}
