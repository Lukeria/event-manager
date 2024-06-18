import { Component, OnInit } from '@angular/core';
import { AuthDataRequest } from '../model/authData';
import { AuthService } from '../service/auth.service';
import { AppMessageService } from '../service/app-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  newAuthRequest = {} as AuthDataRequest;
  validationErrors: any;

  constructor(private authService: AuthService,
    private errorService: AppMessageService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authService.getAuthToken() != null) {
      this.router.navigate(['/main']);
    }
  }

  onSubmit() {
    this.authService.authenticate(this.newAuthRequest).subscribe({
      next: data => {
        this.authService.saveUserData(data);
        this.router.navigate(['/main']);
      },
      error: error => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          this.validationErrors = error.error;
        } else {
          this.validationErrors = {
            login: true,
            password: true
          }
        }
        this.errorService.showProcessErrorMessage(error);
      }
    })
  }
}
