import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { GuestService } from '../service/guest.service';
import { ActivatedRoute } from '@angular/router';
import { Guest, RVSPStatus } from '../model/guest';
import { AppMessageService } from '../service/app-message.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css'
})
export class GuestsComponent implements OnInit {

  eventUuid: string = '';
  guests: Guest[] = [];

  total: number = 0;
  confirmed: number = 0;
  declined: number = 0;
  newGuest = {} as Guest;

  constructor(private route: ActivatedRoute,
    private guestService: GuestService,
    private errorService: AppMessageService,
    private offcanvasService: NgbOffcanvas) {

  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.guestService.getList(this.eventUuid).subscribe({
      next: (data) => {
        this.guests = data;
        this.updateCounts();
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  openGuestForm(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' }).result.then(
      () => {
        this.newGuest = {} as Guest;
      },
      () => {
        this.newGuest = {} as Guest;
      }
    );
  }

  updateCounts() {
    this.total = this.guests.length;
    this.confirmed = this.guests.filter(
      item => item.rvspStatus === RVSPStatus.Confirmed
    ).length;
    this.declined = this.guests.filter(
      item => item.rvspStatus === RVSPStatus.Declined
    ).length;
  }

  getBadgeBg(status: RVSPStatus): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    if (status === RVSPStatus.Confirmed) {
      return 'text-bg-success'
    } else if (status === RVSPStatus.Declined) {
      return 'text-bg-danger'
    }

    return 'text-bg-secondary';
  }

  onSubmit(offcanvas: any) {
    if (this.newGuest.name !== undefined) {
      offcanvas.close('Save click');
      if (this.newGuest.id != null) {
        this.guestService.update(this.eventUuid, this.newGuest).subscribe({
          next: (data) => {
            const index = this.guests.findIndex(item => item.id === data.id);
            this.guests[index] = data;
          },
          error: (error) => {
            this.errorService.showProcessErrorMessageWithRedirect(error);
          }
        });
      } else {
        this.newGuest.rvspStatus = RVSPStatus.Unknown;
        this.guestService.create(this.eventUuid, this.newGuest).subscribe({
          next: (data) => {
            this.guests.push(data);
            this.updateCounts();
          },
          error: (error) => {
            this.errorService.showProcessErrorMessageWithRedirect(error);
          }
        });
      }
    }
  }

  editGuest(guest: Guest) {
    this.newGuest.id = guest.id;
    this.newGuest.name = guest.name;
    this.newGuest.surname = guest.surname;
    this.newGuest.gender = guest.gender;
    this.newGuest.email = guest.email;
  }

  deleteGuest(id: number) {
    this.guestService.deleteById(this.eventUuid, id).subscribe({
      next: () => {
        this.guests = this.guests.filter(item => item.id !== id);
        this.updateCounts();
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  getLocalizedStatus(status: RVSPStatus) {
    if (status === RVSPStatus.Confirmed) {
      return $localize`:@@RVSPStatus.Confirmed:Confirmed`;
    } else if (status === RVSPStatus.Declined) {
      return $localize`:@@RVSPStatus.Declined:Declined`;
    } else {
      return $localize`:@@RVSPStatus.Unknown:Unknown`;
    }
  }
}
