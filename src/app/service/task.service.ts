import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInfo } from '../model/appInfo';
import { Task } from '../model/checklist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  public create(eventUuid: string, checklistId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/${checklistId}/tasks`, task);
  }

  public update(eventUuid: string, checklistId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/${checklistId}/tasks`, task);
  }

  public updateStatus(eventUuid: string, checklistId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/${checklistId}/tasks/status`, task);
  }

  public deleteById(eventUuid: string, checklistId: number, id: number): Observable<Task> {
    return this.http.delete<Task>(AppInfo.basePath + `/api/v1/events/${eventUuid}/checklists/${checklistId}/tasks/${id}`);
  }
}
