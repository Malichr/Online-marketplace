import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  userData = {
    username: '',
    password: '',
    role: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.userData.username || !this.userData.password || !this.userData.role) {
      alert('Minden mező kitöltése kötelező!');
      return;
    }

    if (!['buyer', 'seller'].includes(this.userData.role)) {
      alert('Érvénytelen szerepkör!');
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert(error.error?.message || 'Hiba történt a regisztráció során');
      }
    });
  }
}
