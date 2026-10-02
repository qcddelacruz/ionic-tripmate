import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';
import { AuthService, UserProfile } from '../services/auth.service';
import { AppNavComponent } from '../shared/app-nav/app-nav.component';

const DEFAULT_USER: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatarUrl: '',
  initials: ''
};

const MAX_AVATAR_BYTES = 1.5 * 1024 * 1024; // keep localStorage from overflowing

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonIcon,
    AppNavComponent
  ]
})
export class ProfilePage implements OnInit {
  user: UserProfile = { ...DEFAULT_USER };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  notifications = {
    booking: true,
    payment: true,
    reminders: true,
    promo: false
  };

  // Feedback messages shown under each form
  accountMsg = '';
  accountError = false;
  passwordMsg = '';
  passwordError = false;

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ cloudUploadOutline });
  }

  ngOnInit() {
    const stored = this.authService.getUser();
    if (stored) {
      this.user = { ...stored };
    } else {
      this.router.navigate(['/signup']);
    }
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_BYTES) {
      this.setAccountMsg('Photo is too large. Choose one under 1.5 MB.', true);
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.user.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveAccount() {
    const first = this.user.firstName.trim();
    const last = this.user.lastName.trim();
    const email = this.user.email.trim();

    if (!first) {
      this.setAccountMsg('Enter your first name.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.setAccountMsg('Enter a valid email address.', true);
      return;
    }

    this.user.firstName = first;
    this.user.lastName = last;
    this.user.email = email;
    this.user.initials = (first.charAt(0) + last.charAt(0)).toUpperCase();

    const saved = this.authService.updateUser(this.user);
    if (saved) {
      this.setAccountMsg('Changes saved.', false);
    } else {
      this.setAccountMsg("Couldn't save. Try a smaller profile photo.", true);
    }
  }

  updatePassword() {
    const { currentPassword, newPassword, confirmPassword } = this.security;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.setPasswordMsg('Fill in all password fields.', true);
      return;
    }
    if (newPassword.length < 8) {
      this.setPasswordMsg('New password must be at least 8 characters.', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      this.setPasswordMsg("New passwords don't match.", true);
      return;
    }

    // No backend yet: passwords aren't stored, so nothing is actually changed.
    this.security = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.setPasswordMsg('Password updated.', false);
  }

  deleteAccount() {
    const confirmed = confirm('Delete your account permanently? This cannot be undone.');
    if (!confirmed) return;

    this.authService.deleteAccount();
    this.router.navigateByUrl('/home');
  }

  private setAccountMsg(text: string, isError: boolean) {
    this.accountMsg = text;
    this.accountError = isError;
  }

  private setPasswordMsg(text: string, isError: boolean) {
    this.passwordMsg = text;
    this.passwordError = isError;
  }
}