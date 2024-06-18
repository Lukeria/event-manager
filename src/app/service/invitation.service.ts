import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invitation } from '../model/invitation';
import { AppInfo } from '../model/appInfo';
import { Observable } from 'rxjs';
import { RvspInfo } from '../model/rvspInfo';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private http: HttpClient) { }

  public getInvitation(eventUuid: string): Observable<Invitation> {
    return this.http.get<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation`);
  }

  public getInvitationForRvsp(eventUuid: string): Observable<Invitation> {
    return this.http.get<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation/rvsp`);
  }

  public update(eventUuid: string, invitation: Invitation): Observable<Invitation> {
    return this.http.put<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation`, invitation);
  }

  public create(eventUuid: string, invitation: Invitation): Observable<Invitation> {
    return this.http.post<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation`, invitation);
  }

  public sendInvitations(eventUuid: string, invitationLink: string): Observable<Invitation> {
    return this.http.put<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation/invite`, invitationLink);
  }

  public confirmInvitation(eventUuid: string, rvspInfo: RvspInfo): Observable<Invitation> {
    return this.http.put<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation/confirm`, rvspInfo);
  }


  public deleteById(eventUuid: string, id: number): Observable<Invitation> {
    return this.http.delete<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation/${id}`);
  }

  public uploadFile(eventUuid: string, formData: FormData): Observable<Invitation> {
    return this.http.post<Invitation>(AppInfo.basePath + `/api/v1/events/${eventUuid}/invitation/upload`, formData);
  }
}
