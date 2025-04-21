import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { SalesHistoryComponent } from './components/sales-history/sales-history.component';
import { OrdersHistoryComponent } from './components/orders-history/orders-history.component';
import { authGuard } from './guards/auth.guard';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'create-product', 
    component: ProductCreateComponent,
    canActivate: [() => authGuard('seller')()]
  },
  { 
    path: 'my-sales', 
    component: SalesHistoryComponent,
    canActivate: [() => authGuard('seller')()]
  },
  { 
    path: 'my-orders', 
    component: OrdersHistoryComponent,
    canActivate: [() => authGuard('buyer')()]
  },
  { 
    path: 'favorites', 
    component: FavoritesComponent,
    canActivate: [() => authGuard()()]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
