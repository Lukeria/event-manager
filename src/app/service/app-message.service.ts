import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AppMessageService {

  messages = [] as Toast[];

  constructor(private router: Router) { }

  public showFetchErrorMessageWithRedirect(error: any) {
    console.log(error);
    if (error.status === 404 || error.status === 403) {
      this.router.navigate(['/error-page'], {
        queryParams: {
          errorStatus: Number(error.status),
          errorMessage: error.error
        }
      });
    } else {
      this.messages.push({
        message: `Error fetching data: ${error.status}: ${this.getErrorMessage(error)}`,
        classname: 'bg-danger text-light'
      });
    }
  }

  public showProcessErrorMessageWithRedirect(error: any) {
    if (error.status === 403 || error.status === 404) {
      this.router.navigate(['/error-page'], {
        queryParams: {
          errorStatus: Number(error.status),
          errorMessage: error.error
        }
      });
    } else {
      this.showProcessErrorMessage(error);
    }
  }

  public showProcessErrorMessage(error: any) {
    if (error.error && typeof error.error === 'object') {
      for (const key in error.error) {
        if (error.error.hasOwnProperty(key)) {
          const value = error.error[key];
          if (typeof value === 'string') {
            this.messages.push({
              message: `Error processing data: ${error.status}: ${value}`,
              classname: 'bg-danger text-light'
            });
          }
        }
      }

      if (this.messages.length === 0) {
        this.messages.push({
          message: `Error processing data: ${error.status}: ${this.getErrorMessage(error)}`,
          classname: 'bg-danger text-light'
        });
      }
    } else {

      this.messages.push({
        message: `Error processing data: ${error.status}: ${this.getErrorMessage(error)}`,
        classname: 'bg-danger text-light'
      });
    }
  }

  public showProcessSuccessMessage(message: string) {
    this.messages.push({
      message: message,
      classname: 'bg-success text-light'
    });
  }

  public showProcessDangerMessage(message: string) {
    this.messages.push({
      message: message,
      classname: 'bg-danger text-light'
    });
  }

  private getErrorMessage(error: any) {
    if (error.error) {
      return error.error
    } else {
      return error.message;
    }
  }

  public getMessages(): Toast[] {
    return this.messages
  }

  public remove(toast: Toast) {
    this.messages = this.messages.filter((t) => t !== toast);
  }
}

export interface Toast {
  message: string,
  classname: string
}
