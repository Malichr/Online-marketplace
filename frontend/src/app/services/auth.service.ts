import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: {username: string, password: string}): Observable<any> {
    console.log('Sending login data:', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response.token) {
          this.setToken(response.token);
          this.setUser(response.user);
        }
      })
    );
  }

  register(userData: {username: string, password: string, role: string}): Observable<any> {
    console.log('Sending registration data:', userData);
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getCurrentUserId(): string | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isSeller(): boolean {
    const user = this.getUser();
    return user?.role === 'seller';
  }

  isBuyer(): boolean {
    const user = this.getUser();
    return user?.role === 'buyer';
  }
}
