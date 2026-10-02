import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  locationOutline, calendarOutline, peopleOutline, timeOutline,
  closeOutline, menuOutline
} from 'ionicons/icons';
import { AppNavComponent } from '../shared/app-nav/app-nav.component';

type TripStatus = 'upcoming' | 'pending' | 'past' | 'cancelled';

interface Trip {
  id: string;
  title: string;
  location: string;
  price: number;
  dates: string;
  guests: number;
  image: string;
  status: TripStatus;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonHeader, IonContent, IonIcon, AppNavComponent]
})
export class DashboardPage {
  currentFilter: TripStatus = 'upcoming';
  isSidebarOpen = false;

  // Sample trips data (replace with a service/API call later)
  trips: Trip[] = [
    {
      id: '1',
      title: 'El Nido Beach Resort Villa',
      location: 'El Nido, Palawan',
      price: 12500,
      dates: 'Oct 12 - Oct 16, 2026',
      guests: 2,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Siargao Ocean View Loft',
      location: 'General Luna, Siargao',
      price: 8400,
      dates: 'Nov 01 - Nov 05, 2026',
      guests: 3,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Baguio Pine Cabin',
      location: 'Baguio City',
      price: 6200,
      dates: 'Jan 10 - Jan 14, 2026',
      guests: 4,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      status: 'past'
    }
  ];

  constructor(private router: Router) {
    addIcons({
      locationOutline, calendarOutline, peopleOutline, timeOutline,
      closeOutline, menuOutline
    });
  }

  get filteredTrips(): Trip[] {
    return this.trips.filter(t => t.status === this.currentFilter);
  }

  get upcomingCount(): number { return this.countOf('upcoming'); }
  get pendingCount(): number { return this.countOf('pending'); }
  get pastCount(): number { return this.countOf('past'); }
  get cancelledCount(): number { return this.countOf('cancelled'); }

  private countOf(status: TripStatus): number {
    return this.trips.filter(t => t.status === status).length;
  }

  setFilter(filter: TripStatus) {
    this.currentFilter = filter;
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewTrip(trip: Trip) {
    this.router.navigate(['/stays', trip.id]);
  }
}