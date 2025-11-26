import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'stock-movement', component: DashboardComponent }, // Placeholder for now
      { path: 'reports', component: DashboardComponent }, // Placeholder for now
      { path: 'low-stock', component: DashboardComponent } // Placeholder for now
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
