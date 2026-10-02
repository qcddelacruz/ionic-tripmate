import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { 
  IonHeader, IonContent, IonButton, IonIcon, IonFooter 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  searchOutline, filterOutline, closeOutline, heartOutline, heart, 
  star, addOutline, removeOutline, locationOutline, personOutline, 
  logOutOutline, optionsOutline, bookmarkOutline
} from 'ionicons/icons';

export interface Stay {
  id: string;
  title: string;
  location: string;
  type: 'House rental' | 'Hotel' | 'Cabin' | 'Villa' | 'Resort';
  price: number;
  rating: number;
  reviewsCount: number;
  guests: number;
  amenities: string[];
  image: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-stays',
  templateUrl: './stays.page.html',
  styleUrls: ['./stays.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    IonHeader, 
    IonContent, 
    IonButton, 
    IonIcon, 
    IonFooter
  ]
})
export class StaysPage {
  // Navigation & User State
  isLoggedIn = true;
  isUserDropdownOpen = false;
  isFiltersOpen = false;

  user = {
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    initials: 'JD'
  };

  // Search & Filter State
  searchTerm: string = '';
  priceMin: number = 800;
  priceMax: number = 6000;
  selectedTypes: string[] = [];
  minRating: number = 0;
  guestCount: number = 1;
  selectedAmenities: string[] = [];
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' = 'recommended';

  propertyTypes: string[] = ['House rental', 'Hotel', 'Cabin', 'Villa', 'Resort'];
  amenitiesList: string[] = ['Wifi', 'Pool', 'Kitchen', 'Air conditioning', 'Beachfront', 'Pet friendly'];

  // Sample Stays Data
  stays: Stay[] = [
    {
      id: '1',
      title: 'Driftwood Villa Siargao',
      location: 'General Luna, Siargao',
      type: 'Villa',
      price: 4500,
      rating: 4.9,
      reviewsCount: 42,
      guests: 4,
      amenities: ['Wifi', 'Pool', 'Kitchen', 'Air conditioning', 'Beachfront'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      isFavorite: false
    },
    {
      id: '2',
      title: 'El Nido Beach Resort & Spa',
      location: 'El Nido, Palawan',
      type: 'Resort',
      price: 5800,
      rating: 4.8,
      reviewsCount: 88,
      guests: 2,
      amenities: ['Wifi', 'Pool', 'Air conditioning', 'Beachfront'],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      isFavorite: true
    },
    {
      id: '3',
      title: 'Baguio Pine Tree Cabin',
      location: 'Baguio City',
      type: 'Cabin',
      price: 2400,
      rating: 4.6,
      reviewsCount: 29,
      guests: 6,
      amenities: ['Wifi', 'Kitchen', 'Pet friendly'],
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      isFavorite: false
    },
    {
      id: '4',
      title: 'Cebu City Heritage Hotel',
      location: 'Cebu City',
      type: 'Hotel',
      price: 1800,
      rating: 4.4,
      reviewsCount: 115,
      guests: 2,
      amenities: ['Wifi', 'Air conditioning'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      isFavorite: false
    },
    {
      id: '5',
      title: 'Boracay White Beach House',
      location: 'Station 1, Boracay',
      type: 'House rental',
      price: 3600,
      rating: 4.7,
      reviewsCount: 64,
      guests: 5,
      amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'Beachfront'],
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      isFavorite: false
    },
    {
      id: '6',
      title: 'Sagada Mountain View Lodge',
      location: 'Sagada, Mountain Province',
      type: 'Cabin',
      price: 1200,
      rating: 4.5,
      reviewsCount: 18,
      guests: 3,
      amenities: ['Wifi', 'Pet friendly'],
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
      isFavorite: false
    }
  ];

  constructor() {
    addIcons({
      searchOutline, filterOutline, closeOutline, heartOutline, heart,
      star, addOutline, removeOutline, locationOutline, personOutline,
      logOutOutline, optionsOutline, bookmarkOutline
    });
  }

  get filteredStays(): Stay[] {
    let result = this.stays.filter(stay => {
      // Search term filter
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        const matchesTitle = stay.title.toLowerCase().includes(term);
        const matchesLoc = stay.location.toLowerCase().includes(term);
        if (!matchesTitle && !matchesLoc) return false;
      }

      // Price range filter
      if (stay.price < this.priceMin || stay.price > this.priceMax) {
        return false;
      }

      // Property type filter
      if (this.selectedTypes.length > 0 && !this.selectedTypes.includes(stay.type)) {
        return false;
      }

      // Rating filter
      if (this.minRating > 0 && stay.rating < this.minRating) {
        return false;
      }

      // Guest count filter
      if (stay.guests < this.guestCount) {
        return false;
      }

      // Amenities filter
      if (this.selectedAmenities.length > 0) {
        const hasAll = this.selectedAmenities.every(a => stay.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating-desc': return b.rating - a.rating;
        default: return 0; // recommended
      }
    });
  }

  get hasActiveFilters(): boolean {
    return !!this.searchTerm ||
           this.priceMin > 800 ||
           this.priceMax < 6000 ||
           this.selectedTypes.length > 0 ||
           this.minRating > 0 ||
           this.guestCount > 1 ||
           this.selectedAmenities.length > 0;
  }

  get typeCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.propertyTypes.forEach(type => {
      counts[type] = this.stays.filter(s => s.type === type).length;
    });
    return counts;
  }

  toggleType(type: string) {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
  }

  toggleAmenity(amenity: string) {
    if (this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

  incrementGuests() {
    this.guestCount++;
  }

  decrementGuests() {
    if (this.guestCount > 1) {
      this.guestCount--;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.priceMin = 800;
    this.priceMax = 6000;
    this.selectedTypes = [];
    this.minRating = 0;
    this.guestCount = 1;
    this.selectedAmenities = [];
    this.sortBy = 'recommended';
  }

  toggleFavorite(stay: Stay, event: Event) {
    event.stopPropagation();
    stay.isFavorite = !stay.isFavorite;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.isUserDropdownOpen = false;
  }
}