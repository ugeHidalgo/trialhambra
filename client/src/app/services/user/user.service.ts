import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../../models/user';
import { GlobalsService } from '../../globals/globals.service';

@Injectable()
export class UserService {

  private userUrl: string;
  private authUserUrl: string;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) {
    this.userUrl  = globals.server + 'api/user';
    this.authUserUrl  = globals.server + 'api/auth';
  }

  /**.*/
  isUserAuthenticated(userData: any): Observable<any> {
    return this.http.post<any>(this.authUserUrl, userData);
  }

  /**.*/
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user);
  }

  /**.*/
  updateUser(user: User): Observable<User> {
    const me = this,
          httpOptions = me.createHttpOptionsWithToken();

    return me.http.post<User>(me.userUrl, user, httpOptions);
  }

  /**.*/
  getUser(userName: string): Observable<User> {
    const me = this,
          httpOptions = me.createHttpOptionsWithToken(),
          getUserUrl = `${me.userUrl}/?username=${userName}`,
          user = me.http.get<User>(getUserUrl, httpOptions);
    return user;
  }

   // Private methods -------------

   /**.*/
  private createHttpOptionsWithToken() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization-token': this.globals.getTokenFromLocalStorage()
      })
    };
  }
}

