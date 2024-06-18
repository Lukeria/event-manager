import { Component } from '@angular/core';
import { EventService } from '../service/event.service';
import { Router } from '@angular/router';
import { RequestData } from '../model/request';
import { EventType } from '../model/event';
import { RequestService } from '../service/request.service';
import { RoleNames, UserInfo } from '../model/userInfo';
import { AppMessageService } from '../service/app-message.service';
import { DataSelect } from '../model/viewModel';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.css'
})
export class NewRequestComponent {
  eventTypes: EventType[] = [];
  organizersSelectList: DataSelect[] = [];
  selectedEventType?: EventType;
  selectedOrganizerId?: string;
  newRequest = {} as RequestData;
  validationErrors: any;
  selectedDate?: NgbDateStruct;
  user?: UserInfo;

  constructor(private eventService: EventService,
    private requestService: RequestService,
    private errorService: AppMessageService,
    private router: Router,
    private userService: UserService) {
    this.user = userService.getUserInfo();
  }

  ngOnInit(): void {
    this.getEventTypesList();
    this.getOrganizerList();

    if (this.user?.roleName === RoleNames.Organizer) {
      this.errorService.showFetchErrorMessageWithRedirect({ status: 403 });
    }
  }

  private getEventTypesList(): void {
    this.eventService.getEventTypesList().subscribe({
      next: (data) => {
        this.eventTypes = data;
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  private getOrganizerList(): void {
    this.userService.getOrganizerList().subscribe({
      next: (data) => {
        data.forEach(item =>
          this.organizersSelectList.push({
            value: item.id,
            data: item,
            label: item.name + " " + item.surname
          })
        );
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  setSelectedEventType(eventType: EventType) {
    this.selectedEventType = eventType;
  }

  onDateChanged() {
    if (this.selectedDate != null)
      this.newRequest.eventDate = new Date(this.selectedDate?.year, this.selectedDate?.month - 1, this.selectedDate?.day, 12, 0);
  }

  onSubmit() {
    if (this.selectedEventType !== undefined) {
      this.newRequest.type = this.selectedEventType;
      if (this.selectedOrganizerId != null) {
        this.newRequest.organizer = {
          id: +this.selectedOrganizerId
        };
      }
      this.requestService.create(this.newRequest).subscribe({
        next: (data) => {
          this.router.navigate(['/requests']);
        },
        error: (error) => {
          if (error.status === 400 && error.error && typeof error.error === 'object') {
            this.validationErrors = error.error;
          }
          this.errorService.showProcessErrorMessage(error);
        }
      });
    }
  }
}
