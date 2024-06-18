import { Component, OnInit } from '@angular/core';
import { Invitation } from '../model/invitation';
import { ActivatedRoute } from '@angular/router';
import { AppMessageService } from '../service/app-message.service';
import { InvitationService } from '../service/invitation.service';
import { RvspInfo } from '../model/rvspInfo';
import { RVSPStatus } from '../model/guest';

@Component({
  selector: 'app-invitation-rvsp',
  templateUrl: './invitation-rvsp.component.html',
  styleUrl: './invitation-rvsp.component.css'
})
export class InvitationRvspComponent implements OnInit {

  eventUuid: string = '';
  invitation = {} as Invitation;
  rvspInfo = {} as RvspInfo;
  selectedConfirmOption?: string;

  constructor(private route: ActivatedRoute,
    private appMessageService: AppMessageService,
    private invitationService: InvitationService) {

  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.getInvitation();
  }

  private getInvitation(): void {
    this.invitationService.getInvitationForRvsp(this.eventUuid).subscribe({
      next: (data) => {
        this.invitation = this.updateInvitationData(data);
      }, error: (error) => {
        this.appMessageService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  private updateInvitationData(data: Invitation): Invitation {
    if (data.guest != null) {
      this.rvspInfo.guestUuid = data.guest.uuid;
      this.rvspInfo.name = data.guest.name;
      this.rvspInfo.surname = data.guest.surname;
    }
    return data;
  }

  onRvspFormSubmit() {
    if (this.selectedConfirmOption != null) {
      this.invitationService.confirmInvitation(this.eventUuid, this.rvspInfo).subscribe({
        next: (data) => {
          // this.invitation = this.updateInvitationData(data);
          this.appMessageService.showProcessSuccessMessage($localize`:@@invitation-rvsp-success-message:Invitation is confirmed successfully`);
        },
        error: (error) =>
          this.appMessageService.showProcessErrorMessageWithRedirect(error)
      })
    }
  }

  onPresenceChange(event: Event) {
    const target = event.target || event.currentTarget;
    if (target) {
      if ((target as Element).id === 'presence_yes') {
        this.rvspInfo.rvspStatus = RVSPStatus.Confirmed;
      } else if ((target as Element).id === 'presence_no') {
        this.rvspInfo.rvspStatus = RVSPStatus.Declined;
      } else {
        this.rvspInfo.rvspStatus = RVSPStatus.Unknown;
      }
    }

  }
}
