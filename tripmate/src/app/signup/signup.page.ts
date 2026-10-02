import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline, homeOutline, mailOutline, lockClosedOutline,
  eyeOutline, eyeOffOutline, arrowBackOutline, arrowForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonIcon
  ]
})
export class SignupPage {
  mode: 'guest' | 'host' = 'guest';

  formData = {
    fullName: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  errors: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    addIcons({
      personOutline,
      homeOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
      arrowForwardOutline
    });

    // "Become a Host" links open this page as /signup?type=host
    if (this.route.snapshot.queryParamMap.get('type') === 'host') {
      this.mode = 'host';
    }
  }

  setMode(newMode: 'guest' | 'host') {
    this.mode = newMode;
    this.clearErrors();
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  clearErrors() {
    this.errors = {};
  }

  async onSubmit() {
    this.clearErrors();
    let hasError = false;

    if (!this.formData.fullName.trim()) {
      this.errors['fullName'] = 'Enter your full name.';
      hasError = true;
    }

    if (!this.isValidEmail(this.formData.email.trim())) {
      this.errors['email'] = 'Enter a valid email address.';
      hasError = true;
    }

    if (this.formData.password.length < 8) {
      this.errors['password'] = 'Password must be at least 8 characters.';
      hasError = true;
    }

    if (!this.formData.confirmPassword || this.formData.confirmPassword !== this.formData.password) {
      this.errors['confirmPassword'] = "Passwords don't match.";
      hasError = true;
    }

    if (!this.formData.terms) {
      this.errors['terms'] = 'Please agree to the Terms of Service to continue.';
      hasError = true;
    }

    if (hasError) return;

    this.isSubmitting = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Split "Juan Dela Cruz" -> first "Juan", last "Dela Cruz"
      const nameParts = this.formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ');
      const initials =
        (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();

      const businessName = this.formData.businessName.trim();

      // Saves the account and starts the session (local-only for now)
      this.authService.saveUser({
        firstName,
        lastName,
        email: this.formData.email.trim(),
        phone: '',
        avatarUrl: '',
        initials,
        mode: this.mode,
        businessName: this.mode === 'host' && businessName ? businessName : undefined
      });

      const destination = this.mode === 'host' ? '/host/dashboard' : '/dashboard';
      await this.router.navigateByUrl(destination);
    } catch (error: any) {
      this.errors['email'] = error?.message || 'Unable to create account.';
    } finally {
      this.isSubmitting = false;
    }
  }
}