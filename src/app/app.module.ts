import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChecklistsComponent } from './checklists/checklists.component';
import { BudgetComponent } from './budget/budget.component';
import { GuestsComponent } from './guests/guests.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule, NgbOffcanvasModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { InvitationComponent } from './invitation/invitation.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { NewEventComponent } from './new-event/new-event.component';
import { ItemPickerComponent } from './item-picker/item-picker.component';
import { MainComponent } from './main/main.component';
import { RequestsComponent } from './requests/requests.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { InvitationRvspComponent } from './invitation-rvsp/invitation-rvsp.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestInterceptor } from './interceptor/request-interceptor';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ParticipantConfirmationComponent } from './participant-confirmation/participant-confirmation.component';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import { LocaleService } from './service/locale.service';
import { environment } from '../environments/environment';

registerLocaleData(localeEn);
registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    DashboardComponent,
    NavbarComponent,
    ChecklistsComponent,
    BudgetComponent,
    GuestsComponent,
    FooterComponent,
    InvitationComponent,
    NewEventComponent,
    ItemPickerComponent,
    MainComponent,
    RequestsComponent,
    NewRequestComponent,
    InvitationRvspComponent,
    LoginComponent,
    RegisterComponent,
    ErrorPageComponent,
    ParticipantConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgbOffcanvasModule,
    NgbToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale()
    },
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
