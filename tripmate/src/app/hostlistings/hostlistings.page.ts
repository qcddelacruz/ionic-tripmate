import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonToggle,
  IonTextarea,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  addOutline,
  removeOutline,
  cloudUploadOutline,
  trashOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-host-create-listing',
  templateUrl: './hostlistings.page.html',   // was: './hostcreatelisting.page.html'
  styleUrls: ['./hostlistings.page.scss'],   // was: './hostcreatelisting.page.scss'
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonToggle,
    IonTextarea,
    IonIcon
  ]
})
export class HostlistingsPage {

  currentStep = 1;
  totalSteps = 7;

  steps = [
    'Basics',
    'Pricing',
    'Photos',
    'Amenities',
    'Rules',
    'Calendar',
    'Publish'
  ];

  listing = {
    propertyName: '',
    propertyType: '',
    address: '',

    guests: 1,
    bedrooms: 1,
    bathrooms: 1,

    basePrice: 0,
    cleaningFee: 0,
    securityDeposit: 0,
    weeklyDiscount: 0,

    amenities: [] as string[],

    checkIn: '14:00',
    checkOut: '11:00',

    smoking: false,
    pets: true,
    parties: false,

    customRules: '',

    minStay: 1,
    maxStay: 30,

    published: false
  };

  photos: string[] = [];

  blockedDates: number[] = [];

  calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  amenities = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'tv', label: 'TV' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'pool', label: 'Pool' },
    { value: 'parking', label: 'Free Parking' },
    { value: 'gym', label: 'Gym' },
    { value: 'smoke_alarm', label: 'Smoke Alarm' },
    { value: 'first_aid', label: 'First Aid Kit' }
  ];

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      addOutline,
      removeOutline,
      cloudUploadOutline,
      trashOutline,
      checkmarkCircleOutline
    });
  }

  get progress(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  get serviceFee(): number {
    return Number(this.listing.basePrice || 0) * 0.10;
  }

  get guestTotal(): number {
    return (
      Number(this.listing.basePrice || 0) +
      Number(this.listing.cleaningFee || 0) +
      this.serviceFee
    );
  }

  get hostEarnings(): number {
    return (
      Number(this.listing.basePrice || 0) +
      Number(this.listing.cleaningFee || 0)
    );
  }

  get slug(): string {
    if (!this.listing.propertyName) {
      return 'your-property-name';
    }

    return this.listing.propertyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.scrollTop();
    } else {
      this.saveListing();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollTop();
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }

  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  increment(
    field: 'guests' | 'bedrooms' | 'bathrooms'
  ) {
    const maximum = field === 'guests' ? 16 : 10;

    if (this.listing[field] < maximum) {
      this.listing[field]++;
    }
  }

  decrement(
    field: 'guests' | 'bedrooms' | 'bathrooms'
  ) {
    const minimum = field === 'guests' ? 1 : 0;

    if (this.listing[field] > minimum) {
      this.listing[field]--;
    }
  }

  toggleAmenity(value: string) {
    const index = this.listing.amenities.indexOf(value);

    if (index >= 0) {
      this.listing.amenities.splice(index, 1);
    } else {
      this.listing.amenities.push(value);
    }
  }

  hasAmenity(value: string): boolean {
    return this.listing.amenities.includes(value);
  }

  selectPhotos(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    const files = Array.from(input.files);

    files.forEach(file => {
      if (this.photos.length >= 20) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.photos.push(reader.result as string);
      };

      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  toggleDate(day: number) {
    const index = this.blockedDates.indexOf(day);

    if (index >= 0) {
      this.blockedDates.splice(index, 1);
    } else {
      this.blockedDates.push(day);
    }
  }

  isBlocked(day: number): boolean {
    return this.blockedDates.includes(day);
  }

  saveDraft() {
    const data = {
      ...this.listing,
      photos: this.photos,
      blockedDates: this.blockedDates,
      published: false
    };

    localStorage.setItem(
      'tripmate-listing-draft',
      JSON.stringify(data)
    );

    alert('Listing saved as draft.');
  }

  saveListing() {
    const data = {
      ...this.listing,
      photos: this.photos,
      blockedDates: this.blockedDates
    };

    console.log('TripMate Listing:', data);

    localStorage.setItem(
      'tripmate-listing',
      JSON.stringify(data)
    );

    alert(
      this.listing.published
        ? 'Listing published successfully!'
        : 'Listing saved as draft!'
    );
  }
}