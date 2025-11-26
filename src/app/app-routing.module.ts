import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { OrdersComponent } from './components/orders/orders.component';
import { StockMovementComponent } from './components/stock-movement/stock-movement.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LowStockAlertComponent } from './components/low-stock-alert/low-stock-alert.component';
import { ProfileComponent } from './components/profile/profile.component';

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
      { path: 'stock-movement', component: StockMovementComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'low-stock', component: LowStockAlertComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
