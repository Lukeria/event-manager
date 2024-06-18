import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInfo } from '../model/appInfo';
import { Guest } from '../model/guest';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  public getList(eventUuid: string): Observable<Guest[]> {
    return this.http.get<Guest[]>(AppInfo.basePath + `/api/v1/events/${eventUuid}/guests`);
  }

  public update(eventUuid: string, guest: Guest): Observable<Guest> {
    return this.http.put<Guest>(AppInfo.basePath + `/api/v1/events/${eventUuid}/guests`, guest);
  }

  public create(eventUuid: string, guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(AppInfo.basePath + `/api/v1/events/${eventUuid}/guests`, guest);
  }

  public deleteById(eventUuid: string, id: number): Observable<Guest> {
    return this.http.delete<Guest>(AppInfo.basePath + `/api/v1/events/${eventUuid}/guests/${id}`);
  }
}
