import { Injectable } from '@angular/core';
import { UserInfo } from '../model/userInfo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInfo } from '../model/appInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUserInfo(): UserInfo | undefined {
    const userString = localStorage.getItem("user_info");
    if (userString != null) {
      return JSON.parse(userString);
    }

    return undefined;
  }

  public getOrganizerList(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(AppInfo.basePath + "/api/v1/organizers");
  }

  public register(user: UserInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(AppInfo.basePath + "/api/v1/register", user);
  }
}
