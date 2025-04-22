import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss'
})
export class SalesHistoryComponent implements OnInit {
  sales: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'buyer', 'price', 'soldDate', 'actions'];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.productService.getSales().subscribe({
      next: (sales) => {
        this.sales = sales;
      },
      error: (error) => {
        alert(error.error.message || 'Hiba történt az eladások betöltése során');
      }
    });
  }

  deleteSale(sale: any) {
    if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
      this.productService.deleteProduct(sale._id).subscribe({
        next: () => {
          this.loadSales();
          this.showSuccess('Termék sikeresen törölve');
        },
        error: (error) => {
          this.showError(error.error?.message || 'Hiba történt a termék törlése során');
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
