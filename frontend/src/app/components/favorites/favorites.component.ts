import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.productService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      },
      error: (error) => {
        this.showError('Hiba történt a kedvencek betöltése során');
      }
    });
  }

  removeFavorite(favorite: any) {
    this.productService.toggleFavorite(favorite.product._id).subscribe({
      next: () => {
        this.loadFavorites();
        this.showSuccess('Termék eltávolítva a kedvencekből');
      },
      error: (error) => {
        this.showError('Hiba történt a kedvenc eltávolítása során');
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Bezár', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Bezár', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
} 