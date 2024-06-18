import { Component, OnInit } from '@angular/core';
import { Role, RoleNames, UserInfo } from '../model/userInfo';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { AppMessageService } from '../service/app-message.service';
import { LocaleService } from '../service/locale.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  selectedRole?: Role;
  roles = [] as Role[];
  newUser = {} as UserInfo;
  validationErrors: any;

  constructor(private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private errorService: AppMessageService,
    private localeService: LocaleService) { }

  ngOnInit(): void {
    if (this.authService.getAuthToken() != null) {
      this.router.navigate(['/main']);
    }
    this.getRoles();
  }

  getRoles(): void {
    this.roles = [
      {
        id: 1,
        name: RoleNames.User,
        description: 'Участник'
      },
      {
        id: 2,
        name: RoleNames.Organizer,
        description: 'Организатор'
      }
    ]
  }

  setSelectedRole(role: Role) {
    this.selectedRole = role;
  }

  onSubmit() {
    if (this.selectedRole != null) {
      this.newUser.roleName = this.selectedRole.name;
      this.userService.register(this.newUser).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          if (this.localeService.getLocale() === 'ru') {
            this.errorService.showProcessSuccessMessage('Пользователь успешно зарегистрирован');
          } else {
            this.errorService.showProcessSuccessMessage('User is registered successfully');
          }
        },
        error: (error) => {
          if (error.status === 400 && error.error && typeof error.error === 'object') {
            this.validationErrors = error.error;
          }
          this.errorService.showProcessErrorMessage(error);
        }
      });
    }
  }


}