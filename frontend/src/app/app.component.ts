import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Online Piactér';
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isSeller(): boolean {
    return this.authService.isSeller();
  }

  get isBuyer(): boolean {
    return this.authService.isBuyer();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
