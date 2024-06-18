import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInfo } from '../model/appInfo';
import { UserInfo } from '../model/userInfo';
import { RequestData } from '../model/request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public getById(id: number): Observable<RequestData> {
    return this.http.get<RequestData>(AppInfo.basePath + `/api/v1/requests/${id}`);
  }

  public getList(): Observable<RequestData[]> {
    return this.http.get<RequestData[]>(AppInfo.basePath + "/api/v1/requests");
  }

  public create(request: RequestData): Observable<RequestData> {
    return this.http.post<RequestData>(AppInfo.basePath + `/api/v1/requests`, request);
  }

  public decline(request: RequestData): Observable<RequestData> {
    return this.http.put<RequestData>(AppInfo.basePath + `/api/v1/requests/decline`, request);
  }

  public deleteById(id: number): Observable<RequestData> {
    return this.http.delete<RequestData>(AppInfo.basePath + `/api/v1/requests/${id}`);
  }
}
