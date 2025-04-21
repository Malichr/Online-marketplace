import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {
  product = {
    name: '',
    description: '',
    price: 0
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  createProduct() {
    this.productService.createProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert(error.error.message || 'Hiba történt a termék létrehozása során');
      }
    });
  }
}
