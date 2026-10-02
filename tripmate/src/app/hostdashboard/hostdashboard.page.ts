import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  homeOutline,
  calendarOutline,
  cashOutline,
  addOutline,
  personCircleOutline,
  logOutOutline,
  swapHorizontalOutline,
  businessOutline,
  hourglassOutline,
  peopleOutline,
} from 'ionicons/icons';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonContent,
  IonSplitPane,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonBadge,
} from '@ionic/angular';

import { AuthService } from '../services/auth.service';

export type HostTab = 'overview' | 'listings' | 'bookings' | 'earnings';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface HostBooking {
  guestName: string;
  guestEmail: string;
  property: string;
  dates: string;
  status: BookingStatus;
  amount: number;
}

export interface HostListing {
  id: string;
  title: string;
  location: string;
  price: number;
  pricePeriod: string;
  image?: string;
  pending: boolean;
  bookingsCount: number;
}

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  templateUrl: './hostdashboard.page.html',
  styleUrls: ['./hostdashboard.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonContent,
    IonSplitPane,
    IonMenu,
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonBadge,
  ],
})
export class HostdashboardPage {
  activeTab: HostTab = 'overview';

  // Filled from the logged-in account in the constructor
  user = {
    name: '',
    email: '',
    initials: '',
  };

  stats = {
    totalListings: 0,
    activeBookings: 0,
    monthlyEarnings: 0,
    occupancyRate: 0,
  };

  bookings: HostBooking[] = [];
  listings: HostListing[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      gridOutline,
      homeOutline,
      calendarOutline,
      cashOutline,
      addOutline,
      personCircleOutline,
      logOutOutline,
      swapHorizontalOutline,
      businessOutline,
      hourglassOutline,
      peopleOutline,
    });

    const saved = this.authService.getUser();
    if (saved) {
      this.user = {
        name: `${saved.firstName} ${saved.lastName}`.trim(),
        email: saved.email,
        initials: saved.initials,
      };
    }
  }

  get recentBookings(): HostBooking[] {
    return this.bookings.slice(0, 5);
  }

  setTab(tab: HostTab): void {
    this.activeTab = tab;
  }

  formatCurrency(amount: number): string {
    return '₱' + amount.toLocaleString('en-PH');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}