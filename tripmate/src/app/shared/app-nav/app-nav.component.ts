import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  locationOutline, heartOutline, personOutline, logOutOutline, swapHorizontalOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive, IonIcon]
})
export class AppNavComponent {
  isUserDropdownOpen = false;
  logoFailed = false;

  user$ = this.authService.user$;

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      locationOutline, heartOutline, personOutline, logOutOutline, swapHorizontalOutline
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // Close the dropdown when clicking anywhere outside the user menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!(event.target as HTMLElement).closest('.user-menu')) {
      this.isUserDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.router.navigateByUrl('/login');
  }
}