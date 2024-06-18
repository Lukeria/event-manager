import { Component, Inject, OnInit } from '@angular/core';
import { Invitation } from '../model/invitation';
import { InvitationService } from '../service/invitation.service';
import { ActivatedRoute } from '@angular/router';
import { AppMessageService } from '../service/app-message.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent implements OnInit {

  eventUuid: string = '';
  invitation = {} as Invitation;
  isEditable = false;
  isCreatedMode = false;
  invitationRvspLink?: string;
  isSendLoading = false;

  constructor(private route: ActivatedRoute,
    private appMessageService: AppMessageService,
    private invitationService: InvitationService,
    @Inject(DOCUMENT) private document: Document) {

  }

  setEditableMode() {
    this.isEditable = !this.isEditable;
  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.invitationRvspLink = `${this.document.location.protocol}//${this.document.location.host}/invitation-rvsp`;

    this.getInvitation();
  }

  private getInvitation(): void {
    this.invitationService.getInvitation(this.eventUuid).subscribe({
      next: (data) => {
        this.invitation = data;
        this.isCreatedMode = true;
      }, error: (error) => {
        if (error.status != '404') {
          this.appMessageService.showFetchErrorMessageWithRedirect(error);
        }
      }
    });
  }

  onInvitationFormSubmit() {
    if (this.invitation.header !== undefined) {
      if (this.invitation.id !== undefined) {
        this.invitationService.update(this.eventUuid, this.invitation).subscribe({
          next: data => {
            this.invitation = data;
            this.appMessageService.showProcessSuccessMessage($localize`:@@invitation-updated-message:Invitation is updated successfully`);
            this.isEditable = false;
          },
          error: (error) => {
            this.appMessageService.showProcessErrorMessageWithRedirect(error);
          }
        });
      } else {
        this.invitationService.create(this.eventUuid, this.invitation).subscribe({
          next: data => {
            this.invitation = data;
            this.appMessageService.showProcessSuccessMessage($localize`:@@invitation-created-message:Invitation is created successfully`);
            this.isEditable = false;
          },
          error: (error) => {
            this.appMessageService.showProcessErrorMessageWithRedirect(error);
          }
        })
      }
    }
  }

  sendInvitations() {
    this.isSendLoading = true;
    if (this.invitationRvspLink != null) {
      this.invitationService.sendInvitations(this.eventUuid, this.invitationRvspLink).subscribe({
        next: (data) => {
          this.isSendLoading = false;
          this.appMessageService.showProcessSuccessMessage($localize`:@@invitation-sent-message:Invitations sent successfully`);
        }, error: (error) => {
          this.isSendLoading = false;
          this.appMessageService.showProcessErrorMessageWithRedirect(error);
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target || event.currentTarget;
    if (target != null) {
      const HTMLInputElement = (target as HTMLInputElement);
      if (HTMLInputElement.files) {
        const file: File = HTMLInputElement.files[0]
        if (file) {

          const formData = new FormData();
          formData.append("file", file);
          this.invitationService.uploadFile(this.eventUuid, formData).subscribe({
            next: (data) => {
              this.invitation.imageUrl = data.imageUrl;
              this.appMessageService.showProcessSuccessMessage($localize`:@@invitation-cover-image-message:Invitation cover image is saved successfully`);
            },
            error: (error) => {
              this.appMessageService.showProcessErrorMessageWithRedirect(error);
            }
          });
        }
      }
    }
  }
}
