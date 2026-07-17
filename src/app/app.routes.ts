import { Routes } from '@angular/router';
import { AllCovers } from './components/all-covers/all-covers';
import { Home } from './components/home/home';
import { Account } from './components/account/account';
import { Admin } from './components/admin/admin';
import { Reports } from './components/reports/reports';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'all-covers', component: AllCovers },
  { path: 'account', component: Account },
  { path: 'admin', component: Admin },
  { path: 'reports', component: Reports },
  { path: '**', redirectTo: '' }
];
