import { getCurrencySymbol } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  private currentLocale: string = 'ru';

  constructor() { }

  getLocale(): string {
    return this.currentLocale;
  }

  setLocale(locale: string) {
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
  }

  loadLocale() {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale) {
      this.currentLocale = storedLocale;
    }
  }

  updateCurrencyCode(): string | undefined {
    this.loadLocale();
    if (this.currentLocale === 'ru') {
      return 'Br';
    } else {
      return 'USD';
    }
  }

  getCurrencySymbol(): string {
    return getCurrencySymbol('' + this.updateCurrencyCode(), 'narrow', this.currentLocale);
  }
}
