import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  initials: string;
  mode?: 'guest' | 'host';
  businessName?: string;
}

const USER_KEY = 'tripmate_user';
const SESSION_KEY = 'tripmate_session';

// Local-only stand-in for a real backend. Swap login() for an API call later.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(this.getUser());
  readonly user$ = this.userSubject.asObservable();

  get isLoggedIn(): boolean {
    return localStorage.getItem(SESSION_KEY) === 'true';
  }

  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Called on signup: creates the account and starts the session. */
  saveUser(user: UserProfile): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, 'true');
    this.userSubject.next(user);
  }

  /** Called on profile edits: merges changes into the stored profile. */
  updateUser(partial: Partial<UserProfile>): UserProfile | null {
    const current = this.getUser();
    if (!current) return null;
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    } catch {
      return null; // storage full (e.g. very large avatar photo)
    }
    this.userSubject.next(updated);
    return updated;
  }

  login(email: string): UserProfile | null {
    const user = this.getUser();
    if (!user || user.email.toLowerCase() !== email.trim().toLowerCase()) {
      return null;
    }
    localStorage.setItem(SESSION_KEY, 'true');
    this.userSubject.next(user);
    return user;
  }

  deleteAccount(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    this.userSubject.next(null);
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}