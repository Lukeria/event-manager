import { Component, OnInit } from '@angular/core';
import { EventService } from '../service/event.service';
import { Event } from '../model/event';
import { AppMessageService } from '../service/app-message.service';
import { RoleNames, UserInfo } from '../model/userInfo';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {

  events: Event[] = [];
  user?: UserInfo;
  userRole = RoleNames;

  constructor(private service: EventService,
    private userService: UserService,
    private errorService: AppMessageService) {
    this.user = userService.getUserInfo();
  }

  ngOnInit(): void {
    this.getEventList();
  }

  private getEventList(): void {
    this.service.getList().subscribe({
      next: (data) => {
        this.events = data;
        console.log('Events:', this.events);
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  deleteEvent(id: number) {
    this.service.deleteById(id).subscribe({
      next: (data) => {
        this.events = this.events.filter(item => item.id !== id);
      },
      error: (error) => {
        this.errorService.showProcessErrorMessage(error);
      }
    });
  }



}
