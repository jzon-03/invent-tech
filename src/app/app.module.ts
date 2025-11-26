import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './components/root/root.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AddItemDialogComponent } from './components/add-item-dialog/add-item-dialog.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    DashboardComponent,
    InventoryComponent,
    AddItemDialogComponent,
    CategoriesComponent,
    SuppliersComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
