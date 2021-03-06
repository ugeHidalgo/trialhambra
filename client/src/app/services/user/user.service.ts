import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user.model';
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
  isExistingUsername(username: string): Observable<boolean> {
    const me = this,
          getUserUrl = `${me.authUserUrl}/isusedusername/?username=${username}`;

    return me.http.get<boolean>(getUserUrl);
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
  sendUserPasswordRecoverMail(user: User): Observable<boolean> {
    return this.http.post<boolean>(this.userUrl + '/userrecover', user);
  }

  /**.*/
  updateUserPassword(userName: string, oldHashedPassword, newPassword: any): Observable<boolean> {
    const me = this,
          updateUserPasswordUrl = `${me.userUrl}/${userName}`;
    let data = {
      hashedPassword: oldHashedPassword,
      newPassword: newPassword
    };

    return me.http.post<any>(updateUserPasswordUrl, data);
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

