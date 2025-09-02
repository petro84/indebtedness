import { Component, inject } from '@angular/core';

import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authSvc: AuthService = inject(AuthService);

  get userName() {
    return this.authSvc.displayName;
  }

  logout() {
    this.authSvc.logout();
  }
}
