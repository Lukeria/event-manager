import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  convertDateToNgbDateStruct(date: Date): NgbDateStruct | undefined {
    if (date == null) {
      return undefined;
    }

    const dateObj = new Date(date);
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate()
    };
  }

  convertDateToTimeString(date: Date): string | undefined {
    if (date == null) {
      return undefined;
    }

    const dateObj = new Date(date);
    return `${dateObj.getHours()}:${dateObj.getMinutes()}`;
  }

  convertTimeStringToObj(time: string): Time | undefined {
    if (time == null) {
      return undefined;
    }

    const timeParts = time.split(':');
    if (timeParts.length != 2) {
      return undefined;
    }
    return {
      hours: +timeParts[0],
      minutes: +timeParts[1]
    };
  }
}

export interface Time {
  hours: number;
  minutes: number
}