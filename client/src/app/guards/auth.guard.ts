import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private userService: UserService,
    ) { }

    canActivate() {
        const me = this,
              currentUser = localStorage.getItem('currentUser');

        if (currentUser) {
            if (me.userService.isUserAuthenticated(currentUser)) {
                return true;
            }
        }

        me.router.navigate(['/login']);
        return false;
    }
}
