import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Dashboard } from './components/debts/dashboard/dashboard';

import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorized = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorized } }
];
