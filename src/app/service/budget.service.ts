import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget, BudgetCategory } from '../model/budget';
import { Observable } from 'rxjs';
import { AppInfo } from '../model/appInfo';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }

  public getBudget(eventUuid: string): Observable<Budget> {
    return this.http.get<Budget>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories`);
  }

  public create(eventUuid: string, budgetCategory: BudgetCategory): Observable<BudgetCategory> {
    return this.http.post<BudgetCategory>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories`, budgetCategory);
  }

  public update(eventUuid: string, budgetCategory: BudgetCategory): Observable<BudgetCategory> {
    return this.http.put<BudgetCategory>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories`, budgetCategory);
  }

  public deleteById(eventUuid: string, id: number): Observable<BudgetCategory> {
    return this.http.delete<BudgetCategory>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories/${id}`);
  }
}
