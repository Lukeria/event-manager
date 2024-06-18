import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDataRequest, AuthDataResponse } from '../model/authData';
import { Observable } from 'rxjs';
import { AppInfo } from '../model/appInfo';
import { UserInfo } from '../model/userInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public authenticate(authData: AuthDataRequest): Observable<AuthDataResponse> {
    return this.http.post<AuthDataResponse>(AppInfo.basePath + `/api/v1/authenticate`, authData);
  }

  public saveUserData(auth: AuthDataResponse) {
    if (auth.token != null) {
      localStorage.setItem("auth_token", auth.token);
    } else {
      localStorage.removeItem("auth_token");
    }

    if (auth.userInfo != null) {
      localStorage.setItem("user_info", JSON.stringify(auth.userInfo));
    } else {
      localStorage.removeItem("user_info");
    }
  }

  public getAuthToken(): string | undefined | null {
    return localStorage.getItem("auth_token");
  }

  public removeAuth() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
  }

}
