import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInfo } from '../model/appInfo';
import { Payment } from '../model/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  public create(eventUuid: string, budgetCategoryId: number, payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories/${budgetCategoryId}/payments`, payment);
  }

  public update(eventUuid: string, budgetCategoryId: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories/${budgetCategoryId}/payments`, payment);
  }

  public deleteById(eventUuid: string, budgetCategoryId: number, id: number): Observable<Payment> {
    return this.http.delete<Payment>(AppInfo.basePath + `/api/v1/events/${eventUuid}/budget-categories/${budgetCategoryId}/payments/${id}`);
  }
}
