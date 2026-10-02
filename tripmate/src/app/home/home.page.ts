import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent
  ]
})
export class HomePage implements OnInit {
  isLoggedIn = false;
  isDropdownOpen = false;
  user: User | null = null;

  // Search models
  destination = '';
  checkIn = '';
  checkOut = '';

  constructor(private router: Router, private eRef: ElementRef) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const userSession = localStorage.getItem('tripmate_user');
    const token = localStorage.getItem('tripmate_session');

    if (userSession && token) {
      this.isLoggedIn = true;
      this.user = JSON.parse(userSession);
    } else {
      this.isLoggedIn = false;
      this.user = null;
    }
  }

  get initials(): string {
    if (!this.user?.name) return 'G';
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  onSearch() {
    this.router.navigate(['/stays'], {
      queryParams: {
        destination: this.destination,
        checkIn: this.checkIn,
        checkOut: this.checkOut
      }
    });
  }

  logout() {
    localStorage.removeItem('tripmate_user');
    localStorage.removeItem('tripmate_session');
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
    this.user = null;
    this.router.navigate(['/login']);
  }
}