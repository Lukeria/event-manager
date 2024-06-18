import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleNames, UserInfo } from '../model/userInfo';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { LocaleService } from '../service/locale.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  @Input()
  withSidebar: boolean = true;
  uuid: string = '';
  user?: UserInfo;
  userRole = RoleNames;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private localeService: LocaleService) {
    this.user = userService.getUserInfo();
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
  }

  onLogout() {
    this.authService.removeAuth();
    this.router.navigate(['/login']);
  }

  switchLocale() {
    const locale = this.localeService.getLocale();
    if (locale == 'ru') {
      this.localeService.setLocale('en-US');
      this.router.navigate(['/en-US/']);
    } else {
      this.localeService.setLocale('ru');
      this.router.navigate(['/ru/']);
    }
    window.location.reload(); // Reload the application to apply the new locale

    // let locale = this.localeService.getLocale();
    // if (locale == 'ru') {
    //   locale = 'en-US';
    // } else {
    //   locale = 'ru';
    // }

    // // Get the current URL path
    // const currentUrl = this.router.url;

    // // Construct the new URL with the selected locale
    // const newUrl = `/event-manager/${locale}${currentUrl}`;

    // // Navigate to the new URL
    // this.router.navigateByUrl(newUrl);
  }
}
