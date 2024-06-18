import { Injectable } from '@angular/core';
import { Checklist, ChecklistProgress } from '../model/checklist';
import { AppInfo } from '../model/appInfo';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private http: HttpClient) { }

  public getList(eventUuid: string): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists`);
  }

  public getProgressList(eventUuid: string): Observable<ChecklistProgress[]> {
    return this.http.get<ChecklistProgress[]>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/progress`);
  }

  public create(eventUuid: string, checklist: Checklist): Observable<Checklist> {
    return this.http.post<Checklist>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists`, checklist);
  }

  public update(eventUuid: string, checklist: Checklist): Observable<Checklist> {
    return this.http.put<Checklist>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists`, checklist);
  }

  public deleteById(eventUuid: string, id: number): Observable<Checklist> {
    return this.http.delete<Checklist>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/${id}`);
  }
}
