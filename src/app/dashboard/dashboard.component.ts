import { Component, Inject, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../service/event.service';
import { Event, EventType } from '../model/event';
import { ChecklistProgress } from '../model/checklist';
import { ChecklistService } from '../service/checklist.service';
import { AppMessageService } from '../service/app-message.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../service/date.service';
import { DOCUMENT } from '@angular/common';
import { ParticipantInvitationInfo } from '../model/userInfo';
import { LocaleService } from '../service/locale.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  uuid: string = '';
  event = {
    type: {} as EventType
  } as Event;
  isEditable = false;
  selectedDate?: NgbDateStruct;
  validationErrors: any;
  currencySymbol?: string;
  currencyCode?: string;

  participantConfirmationLink?: string;
  inviteEmail?: string;
  isInviteLoading = false;

  checklistProgress = [] as ChecklistProgress[];

  constructor(private route: ActivatedRoute,
    private eventService: EventService,
    private checklistService: ChecklistService,
    private errorService: AppMessageService,
    private dateService: DateService,
    @Inject(DOCUMENT) private document: Document,
    private modalService: NgbModal,
    private localeService: LocaleService) {
    this.currencySymbol = localeService.getCurrencySymbol();
    this.currencyCode = localeService.updateCurrencyCode();
  }

  onDateChanged() {
    if (this.selectedDate != null)
      this.event.date = new Date(this.selectedDate?.year, this.selectedDate?.month - 1, this.selectedDate?.day, 12, 0);
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.getEvent();
    this.getProgressList();
  }

  private getEvent(): void {
    this.eventService.getByUUID(this.uuid).subscribe({
      next: (data) => {
        this.event = data;
        this.selectedDate = this.dateService.convertDateToNgbDateStruct(this.event.date);
        this.participantConfirmationLink = `${this.document.location.protocol}//${this.document.location.host}/participant-confirmation/${this.event.uuid}`;
      },
      error: (error) =>
        this.errorService.showFetchErrorMessageWithRedirect(error)
    });
  }

  private getProgressList(): void {
    this.checklistService.getProgressList(this.uuid).subscribe({
      next: (data) => {
        this.checklistProgress = data;
      },
      error: (error) =>
        this.errorService.showFetchErrorMessageWithRedirect(error)
    });
  }

  setEditableMode() {
    this.isEditable = !this.isEditable;
  }

  onSubmit() {
    this.eventService.update(this.event!).subscribe({
      next: (data) => {
        this.event = data;
        this.isEditable = false;
      },
      error: (error) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          this.validationErrors = error.error;
        }
        this.errorService.showProcessErrorMessage(error);
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => {
        this.inviteEmail = undefined;
      }
    );
  }

  onInvitationFormSubmit(modal: any) {
    this.isInviteLoading = true;
    let inviteInfo = {
      email: this.inviteEmail,
      participantConfirmationLink: this.participantConfirmationLink
    } as ParticipantInvitationInfo;

    this.eventService.inviteUser(this.event.uuid, inviteInfo).subscribe({
      next: (data) => {
        this.isInviteLoading = false;
        modal.close('Save click');
        this.errorService.showProcessSuccessMessage($localize`:@@dashboard-invite-message:Invitation sent to participant`);
      },
      error: error => {
        this.isInviteLoading = false;
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          this.validationErrors = error.error;
        }
        this.errorService.showProcessErrorMessage(error);
      }
    });
  }

}
