import { Component, OnInit } from '@angular/core';
import { RequestData, RequestStatus } from '../model/request';
import { RequestService } from '../service/request.service';
import { Router } from '@angular/router';
import { AppMessageService } from '../service/app-message.service';
import { RoleNames, UserInfo } from '../model/userInfo';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {

  status = RequestStatus;
  user?: UserInfo;
  userRole = RoleNames;

  constructor(private requestService: RequestService,
    private userService: UserService,
    private router: Router,
    private errorService: AppMessageService) {
    this.user = userService.getUserInfo();
  }

  requests: RequestData[] = [];

  ngOnInit(): void {
    this.getRequestList();
  }

  private getRequestList(): void {
    this.requestService.getList().subscribe({
      next: (data) => {
        this.requests = data;
        this.sortRequests();
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  private sortRequests() {
    this.requests.sort((a, b) => {
      if (a.status === RequestStatus.Created && b.status === RequestStatus.Declined) {
        return -1; // a should come before b
      } else if (a.status === RequestStatus.Declined && b.status === RequestStatus.Created) {
        return 1; // b should come before a
      } else {
        // If both are same status or both are CREATED or both are DECLINED
        return 0;
      }
    });
  }

  createEvent(request: RequestData) {
    this.router.navigate(['/events/new'], { queryParams: { id: request.id } });
  }

  deleteRequest(id: number) {
    this.requestService.deleteById(id).subscribe({
      next: data => {
        this.requests = this.requests.filter(item => item.id !== id);
        this.sortRequests();
      },
      error: (error) => {
        this.errorService.showProcessErrorMessage(error);
      }
    });
  }

  declineRequest(requestData: RequestData) {
    this.requestService.decline(requestData).subscribe({
      next: data => {
        const updatingRequestId = this.requests.findIndex(i => i.id === data.id);
        this.requests[updatingRequestId] = data;
        this.sortRequests();
      },
      error: (error) => {
        this.errorService.showProcessErrorMessage(error);
      }
    });
  }

  getRequestBg(status: string): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    if (status === RequestStatus.Created) {
      return 'text-bg-secondary';
    } else if (status === RequestStatus.Declined) {
      return 'text-bg-danger';
    }
    return 'd-none';
  }

  getRequestStatus(status: string): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    if (status === RequestStatus.Created) {
      return 'Requested';
    } else if (RequestStatus.Declined) {
      return 'Declined';
    }
    return '';
  }

}
