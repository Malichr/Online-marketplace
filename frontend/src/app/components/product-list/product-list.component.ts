import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ProductEditComponent } from '../product-edit/product-edit.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  favorites: Set<string> = new Set();
  editingProduct: any = null;

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
    if (this.authService.isLoggedIn()) {
      this.loadFavorites();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Hiba a termékek betöltésekor:', error);
        this.showError('Hiba történt a termékek betöltése során');
      }
    });
  }

  buyProduct(product: any) {
    if (!this.authService.isLoggedIn()) {
      this.showError('A vásárláshoz be kell jelentkezni!');
      return;
    }

    this.productService.buyProduct(product._id).subscribe({
      next: () => {
        product.sold = true;
        this.showSuccess('Sikeres vásárlás!');
      },
      error: (error) => {
        this.showError(error.error?.message || 'Hiba történt a vásárlás során');
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

  canBuy(product: any): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return this.authService.isLoggedIn() &&
           currentUserId !== null &&
           product.seller._id !== currentUserId;
  }

  get isBuyer(): boolean {
    return this.authService.isBuyer();
  }

  loadFavorites() {
    this.productService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = new Set(favorites.map(f => f.product._id));
      }
    });
  }

  toggleFavorite(product: any, event: Event) {
    event.stopPropagation();
    this.productService.toggleFavorite(product._id).subscribe({
      next: (response) => {
        if (response.isFavorite) {
          this.favorites.add(product._id);
          this.showSuccess('Termék hozzáadva a kedvencekhez');
        } else {
          this.favorites.delete(product._id);
          this.showSuccess('Termék eltávolítva a kedvencekből');
        }
      },
      error: (error) => {
        this.showError('Hiba történt a kedvencek módosítása során');
      }
    });
  }

  isFavorite(productId: string): boolean {
    return this.favorites.has(productId);
  }

  isOwnProduct(product: any): boolean {
    return this.authService.isSeller() &&
           product.seller._id === this.authService.getCurrentUserId();
  }

  deleteProduct(product: any) {
    if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => {
          this.loadProducts();
          this.showSuccess('Termék sikeresen törölve');
        },
        error: (error) => {
          this.showError(error.error?.message || 'Hiba történt a termék törlése során');
        }
      });
    }
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '400px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(result._id, {
          name: result.name,
          description: result.description,
          price: result.price
        }).subscribe({
          next: () => {
            this.loadProducts();
            this.showSuccess('Termék sikeresen módosítva');
          },
          error: (error) => {
            this.showError(error.error?.message || 'Hiba történt a termék módosítása során');
          }
        });
      }
    });
  }
}
