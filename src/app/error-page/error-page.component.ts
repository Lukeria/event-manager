import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent implements OnInit {

  error: any

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const errorData = this.activatedRoute.snapshot.queryParams;
    this.error = {
      status: errorData['errorStatus'],
      error: errorData['errorMessage']
    };

    if (this.error.status == 403 && this.error.message == null) {
      this.error.message = 'Access is not allowed';
      this.authService.removeAuth();
    }
  }

  getErrorMessage() {
    if (this.error.message) {
      return this.error.message
    } else {
      return this.error.error;
    }
  }

}
