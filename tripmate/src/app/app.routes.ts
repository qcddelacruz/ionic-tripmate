import { Routes } from '@angular/router';
import { authGuard, hostGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
  { path: 'login', loadComponent: () => import('./login/login.page').then((m) => m.LoginPage) },
  { path: 'signup', loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage) },
  { path: 'stays', loadComponent: () => import('./stays/stays.page').then((m) => m.StaysPage) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  { path: 'wishlist', loadComponent: () => import('./wishlist/wishlist.page').then((m) => m.WishlistPage) },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage),
  },

  // Host routes (paths now match what the app navigates to)
  {
    path: 'host/dashboard',
    canActivate: [hostGuard],
    loadComponent: () => import('./hostdashboard/hostdashboard.page').then((m) => m.HostdashboardPage),
  },
  {
    path: 'host/listings',
    canActivate: [hostGuard],
    loadComponent: () => import('./hostlistings/hostlistings.page').then((m) => m.HostlistingsPage),
  },
  // Old paths, kept so nothing breaks
  { path: 'hostdashboard', redirectTo: 'host/dashboard', pathMatch: 'full' },
  { path: 'hostlistings', redirectTo: 'host/listings', pathMatch: 'full' },

  { path: 'forgotpassword', loadComponent: () => import('./forgotpassword/forgotpassword.page').then((m) => m.ForgotpasswordPage) },
  { path: 'property', loadComponent: () => import('./property/property.page').then((m) => m.PropertyPage) },
  { path: 'admin', loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage) },

  { path: '**', redirectTo: 'home' },
];