import { Component, OnInit } from '@angular/core';
import { EventType, Event } from '../model/event';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../service/request.service';
import { AppMessageService } from '../service/app-message.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../service/date.service';
import { RoleNames, UserInfo } from '../model/userInfo';
import { UserService } from '../service/user.service';
import { LocaleService } from '../service/locale.service';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent implements OnInit {

  eventTypes: EventType[] = [];
  selectedEventType?: EventType;
  newEvent = {} as Event;
  validationErrors: any;
  selectedDate?: NgbDateStruct;
  user?: UserInfo;
  currencySymbol?: string;

  constructor(private eventService: EventService,
    private requestService: RequestService,
    private errorService: AppMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService,
    private userService: UserService,
    private localeService: LocaleService) {
    this.currencySymbol = localeService.getCurrencySymbol();
    this.user = userService.getUserInfo();
  }

  ngOnInit(): void {
    this.getEventList();
    this.fillByRequest();

    if (this.user?.roleName === RoleNames.User) {
      this.errorService.showFetchErrorMessageWithRedirect({ status: 403 });
    }
  }

  private getEventList() {
    this.eventService.getEventTypesList().subscribe({
      next: data => {
        this.eventTypes = data;
      },
      error: error => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  private fillByRequest() {
    const requestIdData = this.activatedRoute.snapshot.queryParams;
    if (requestIdData !== undefined) {
      if (requestIdData['id'] !== undefined) {
        this.requestService.getById(requestIdData['id']).subscribe({
          next: requestData => {
            this.newEvent.name = requestData.eventName;
            this.newEvent.description = requestData.eventDescription;
            this.newEvent.date = requestData.eventDate;
            this.selectedDate = this.dateService.convertDateToNgbDateStruct(requestData.eventDate);
            this.newEvent.time = requestData.eventTime;
            this.newEvent.place = requestData.eventPlace;
            this.newEvent.requestId = requestData.id;
            this.setSelectedEventType(requestData.type);
            console.log("New event " + this.selectedEventType);
          },
          error: error => {
            this.errorService.showFetchErrorMessageWithRedirect(error);
          }
        });
      }
    }
  }

  setSelectedEventType(eventType: EventType) {
    this.selectedEventType = eventType;
  }

  onDateChanged() {
    if (this.selectedDate != null)
      this.newEvent.date = new Date(this.selectedDate?.year, this.selectedDate?.month - 1, this.selectedDate?.day, 12, 0);
  }

  onSubmit() {
    if (this.selectedEventType !== undefined) {
      this.newEvent.type = this.selectedEventType;

      this.eventService.create(this.newEvent).subscribe({
        next: data => this.router.navigate(['/events']),
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
