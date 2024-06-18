import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInfo } from '../model/appInfo';
import { Observable } from 'rxjs';
import { Event, EventType } from '../model/event';
import { ParticipantInvitationInfo } from '../model/userInfo';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getList(): Observable<Event[]> {
    return this.http.get<Event[]>(AppInfo.basePath + "/api/v1/events");
  }

  public getEventTypesList(): Observable<EventType[]> {
    return this.http.get<EventType[]>(AppInfo.basePath + "/api/v1/event-types");
  }

  public getByUUID(uuid: string): Observable<Event> {
    return this.http.get<Event>(AppInfo.basePath + `/api/v1/events/${uuid}`);
  }

  public update(event: Event): Observable<Event> {
    return this.http.put<Event>(AppInfo.basePath + `/api/v1/events`, event);
  }

  public create(event: Event): Observable<Event> {
    return this.http.post<Event>(AppInfo.basePath + `/api/v1/events`, event);
  }

  public deleteById(id: number): Observable<Event> {
    return this.http.delete<Event>(AppInfo.basePath + `/api/v1/events/${id}`);
  }

  public inviteUser(uuid: string, inviteInfo: ParticipantInvitationInfo): Observable<Event> {
    return this.http.put<Event>(AppInfo.basePath + `/api/v1/events/${uuid}/invite`, inviteInfo);
  }

  public addUserToEvent(uuid: string, token: string): Observable<Event> {
    return this.http.put<Event>(AppInfo.basePath + `/api/v1/events/${uuid}/users`, token);
  }
}
