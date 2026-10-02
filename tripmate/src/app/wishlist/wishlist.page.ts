import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader } from '@ionic/angular';
import { AppNavComponent } from '../shared/app-nav/app-nav.component';

export interface WishlistItem {
  id: number;
  title: string;
  location: string;
  badge?: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  savedDate: string;
}

// Simple placeholder (data URI) used if a remote image fails to load.
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#E9E4D6"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#64748B"
            text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
    </svg>`
  );

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, RouterModule, AppNavComponent]
})
export class WishlistPage {
  viewMode: 'grid' | 'list' = 'grid';
  selectedSort: string = 'recent';

  wishlistItems: WishlistItem[] = [
    {
      id: 1,
      title: 'El Nido Villa with Private Pool',
      location: 'El Nido, Palawan',
      badge: 'Superhost',
      price: 8500,
      rating: 4.95,
      reviewsCount: 42,
      imageUrl: 'https://picsum.photos/seed/elnido-villa-pool/800/600',
      savedDate: 'Added 2 days ago'
    },
    {
      id: 2,
      title: 'Modern BGC Skyline Loft',
      location: 'Taguig, Metro Manila',
      price: 3400,
      rating: 4.88,
      reviewsCount: 118,
      imageUrl: 'https://picsum.photos/seed/bgc-skyline-loft/800/600',
      savedDate: 'Added 1 week ago'
    }
  ];

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  removeItem(id: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
  }

  sortItems(): void {
    if (this.selectedSort === 'price-asc') {
      this.wishlistItems.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'price-desc') {
      this.wishlistItems.sort((a, b) => b.price - a.price);
    } else if (this.selectedSort === 'rating') {
      this.wishlistItems.sort((a, b) => b.rating - a.rating);
    }
  }

  // Swap in a placeholder if a remote image URL 404s or is blocked.
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = FALLBACK_IMAGE;
  }
}