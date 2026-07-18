import { Routes } from '@angular/router';
import { AllCovers } from './components/all-covers/all-covers';
import { Home } from './components/home/home';
import { Account } from './components/account/account';
import { Admin } from './components/admin/admin';
import { Reports } from './components/reports/reports';
import { Login } from './components/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'all-covers', component: AllCovers, canActivate: [authGuard] },
  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
  { path: 'reports', component: Reports, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
