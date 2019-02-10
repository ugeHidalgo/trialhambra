import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from './globals/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'MoWizz App';
  topMenuData: any;

  constructor ( protected globals: GlobalsService, private router: Router ) {
    const me = this,
          username = me.globals.getUserNameFromLocalStorage();

    me.globals.setUser(username);

    this.topMenuData = JSON.parse(`[{
        "text": "File",
        "submenus": [{
          "text": "Accounts",
          "routerLink": "/accounts"
        }, {
          "text": "Cost centres",
          "routerLink": "/costcentres"
        }]
      }]
    `);
  }

  onClick(link) {
    this.router.navigate([link]);
  }

  logout() {
    const me = this;

    me.globals.clearUser();
    me.globals.removeUserDataFromLocalStorage();
    me.router.navigate(['/']);
  }
}
