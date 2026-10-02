import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent
  ]
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  async onLogin() {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Enter your email and password.';
      return;
    }

    // Local-only check (see AuthService): matches the email against the one
    // account stored on this device. The password isn't verified because
    // there's no backend yet.
    const user = this.authService.login(this.email);

    if (!user) {
      this.errorMessage = 'No account found with that email. Try signing up first.';
      return;
    }

    const destination = user.mode === 'host' ? '/host/dashboard' : '/dashboard';
    const ok = await this.router.navigateByUrl(destination);

    if (!ok) {
      console.warn('Navigation to', destination, 'failed');
    }
  }
}