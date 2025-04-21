import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['productName', 'seller', 'price', 'purchaseDate', 'actions'];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.productService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        alert(error.error.message || 'Hiba történt a vásárlások betöltése során');
      }
    });
  }

  deleteOrder(order: any) {
    if (confirm('Biztosan törölni szeretné ezt a rendelést?')) {
      this.productService.deleteOrder(order._id).subscribe({
        next: () => {
          this.loadOrders();
          this.showSuccess('Rendelés sikeresen törölve');
        },
        error: (error) => {
          this.showError(error.error?.message || 'Hiba történt a rendelés törlése során');
        }
      });
    }
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
