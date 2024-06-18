import { Component, OnInit, inject } from '@angular/core';
import { AppMessageService } from './service/app-message.service';
import { LocaleService } from './service/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'event-manager';
  appMessageService = inject(AppMessageService);

  constructor(private localeService: LocaleService) { }

  ngOnInit(): void {
    this.localeService.loadLocale();
  }
}
