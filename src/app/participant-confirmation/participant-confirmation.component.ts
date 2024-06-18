import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { AppMessageService } from '../service/app-message.service';

@Component({
  selector: 'app-participant-confirmation',
  templateUrl: './participant-confirmation.component.html',
  styleUrl: './participant-confirmation.component.css'
})
export class ParticipantConfirmationComponent implements OnInit {

  eventUuid: string = '';
  token: string = '';
  isLoading = true;
  processingMessage = 'Participant confirmation is processing...';

  constructor(private route: ActivatedRoute,
    private eventService: EventService,
    private errorService: AppMessageService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.token = this.route.snapshot.params['token'];

    this.confirmEventParticipant();
  }

  private confirmEventParticipant() {
    this.eventService.addUserToEvent(this.eventUuid, this.token).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/events']);
      },
      error: (error) => {
        this.isLoading = false;
        this.processingMessage = 'An error occurred while processing the confirmation';
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    })
  }

}
