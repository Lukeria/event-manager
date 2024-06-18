import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { BudgetComponent } from './budget/budget.component';
import { ChecklistsComponent } from './checklists/checklists.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuestsComponent } from './guests/guests.component';
import { InvokeFunctionExpr } from '@angular/compiler';
import { InvitationComponent } from './invitation/invitation.component';
import { NewEventComponent } from './new-event/new-event.component';
import { MainComponent } from './main/main.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { RequestsComponent } from './requests/requests.component';
import { InvitationRvspComponent } from './invitation-rvsp/invitation-rvsp.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ParticipantConfirmationComponent } from './participant-confirmation/participant-confirmation.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events/new', component: NewEventComponent },
  { path: 'events', component: EventsComponent },
  { path: 'requests/new', component: NewRequestComponent },
  { path: 'requests', component: RequestsComponent },
  { path: 'participant-confirmation/:uuid/:token', component: ParticipantConfirmationComponent },
  { path: 'budget/:uuid', component: BudgetComponent },
  { path: 'checklists/:uuid', component: ChecklistsComponent },
  { path: 'dashboard/:uuid', component: DashboardComponent },
  { path: 'guests/:uuid', component: GuestsComponent },
  { path: 'invitation-overview/:uuid', component: InvitationComponent },
  { path: 'invitation-rvsp/:uuid', component: InvitationRvspComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
