import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule]
})
export class ForgotpasswordPage {
  email = '';
  emailError = '';
  isSending = false;

  showConfirm = false;
  sentEmail = '';

  toastMessage = '';
  toastVisible = false;
  toastIsError = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router) {}

  async onSubmit(): Promise<void> {
    this.emailError = '';
    const email = this.email.trim();

    if (!this.isValidEmail(email)) {
      this.emailError = 'Enter a valid email address.';
      return;
    }

    this.isSending = true;
    try {
      await this.requestResetLink(email);
      this.sentEmail = email;
      this.showConfirm = true;
    } catch (err: any) {
      this.emailError = err?.message || 'Unable to request a reset link.';
    } finally {
      this.isSending = false;
    }
  }

  backToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  resendLink(): void {
    this.showToast(`Reset link re-sent to ${this.sentEmail}.`);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private async requestResetLink(email: string): Promise<void> {
    const response = await fetch('/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'No account found with this email.');
    }
  }

  private showToast(message: string, isError = false): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage = message;
    this.toastIsError = isError;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => (this.toastVisible = false), 3000);
  }
}