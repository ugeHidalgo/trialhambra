import { Component, OnInit, HostBinding, ViewContainerRef, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { slideInDownAnimation } from '../../animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ComponentCanDeactivate } from '../../guards/pending-changes.guard';

import { User } from '../../models/user';
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

  constructor(
    private location: Location,
    protected globals: GlobalsService,
    private userService: UserService,
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
      const me = this;

      me.toastr.setRootViewContainerRef(vcr);
      me.createForm();
  }

  ngOnInit() {
    const me = this;
    me.username = me.globals.userNameLogged;
    me.getLoggedUser(me.username);
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.validatingForm.pristine;
  }

  // Buttons actions
  onClickRefresh() {
    this.rebuildForm();
  }

  onClickSave(): void {
    const me = this;

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

    me.validatingForm = me.fb.group({
      password: ['', Validators.required ],
      firstName: [ '' ],
      lastName: '',
      eMail: ''
    });
  }

  rebuildForm() {
    const me = this;

    me.validatingForm.reset({
      password: me.user.password,
      firstName: me.user.firstName,
      lastName: me.user.lastName,
      eMail: me.user.eMail
    });
  }

  getFormData(): User {
    const me = this,
          formModel = me.validatingForm.value,
          newUser: User = me.user;

    newUser.password = formModel.password;
    newUser.firstName = formModel.firstName;
    newUser.lastName = formModel.lastName;
    newUser.eMail = formModel.eMail;

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

}
