import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  imageUrl?: string;
  lastUpdated: Date;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['select', 'image', 'sku', 'name', 'category', 'stock', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<InventoryItem>();
  selection = new SelectionModel<InventoryItem>(true, []);
  
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  viewMode = 'table';
  totalItems = 0;

  // Sample data
  inventoryData: InventoryItem[] = [
    {
      id: 1,
      sku: 'WH-001',
      name: 'Wireless Headphones',
      description: 'Bluetooth 5.0 wireless headphones with noise cancellation',
      category: 'Electronics',
      stock: 45,
      minStock: 10,
      price: 99.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 2,
      sku: 'SC-002',
      name: 'Smartphone Cases',
      description: 'Premium protective cases for various smartphone models',
      category: 'Electronics',
      stock: 8,
      minStock: 15,
      price: 24.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 3,
      sku: 'LC-003',
      name: 'Laptop Chargers',
      description: 'Universal laptop chargers compatible with multiple brands',
      category: 'Electronics',
      stock: 0,
      minStock: 5,
      price: 49.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 4,
      sku: 'TS-004',
      name: 'Cotton T-Shirts',
      description: 'Premium cotton t-shirts in various colors and sizes',
      category: 'Clothing',
      stock: 120,
      minStock: 20,
      price: 19.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 5,
      sku: 'JS-005',
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans for men and women',
      category: 'Clothing',
      stock: 35,
      minStock: 10,
      price: 59.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 6,
      sku: 'CP-006',
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      category: 'Home & Garden',
      stock: 15,
      minStock: 8,
      price: 89.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 7,
      sku: 'YM-007',
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat with carrying strap',
      category: 'Sports',
      stock: 25,
      minStock: 12,
      price: 34.99,
      imageUrl: '',
      lastUpdated: new Date()
    },
    {
      id: 8,
      sku: 'SB-008',
      name: 'Sports Water Bottle',
      description: 'Insulated stainless steel water bottle',
      category: 'Sports',
      stock: 5,
      minStock: 20,
      price: 29.99,
      imageUrl: '',
      lastUpdated: new Date()
    }
  ];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.data = this.inventoryData;
    this.totalItems = this.inventoryData.length;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    let filteredData = this.inventoryData;

    // Apply search filter
    if (this.searchTerm) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filteredData = filteredData.filter(item => item.category === this.selectedCategory);
    }

    // Apply status filter
    if (this.selectedStatus) {
      filteredData = filteredData.filter(item => {
        const status = this.getStatusText(item.stock, item.minStock).toLowerCase().replace(' ', '-');
        return status === this.selectedStatus;
      });
    }

    this.dataSource.data = filteredData;
    this.totalItems = filteredData.length;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.dataSource.data = this.inventoryData;
    this.totalItems = this.inventoryData.length;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  selectRow(row: InventoryItem) {
    this.selection.toggle(row);
  }

  getStockClass(stock: number, minStock: number): string {
    if (stock === 0) return 'status-out-of-stock';
    if (stock <= minStock) return 'status-low-stock';
    return 'status-in-stock';
  }

  getStatusText(stock: number, minStock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  }

  getStatusClass(stock: number, minStock: number): string {
    if (stock === 0) return 'status-chip-out';
    if (stock <= minStock) return 'status-chip-low';
    return 'status-chip-in';
  }

  getGridData(): InventoryItem[] {
    return this.dataSource.data;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add the new item to the inventory
        const newItem = result as InventoryItem;
        this.inventoryData.push(newItem);
        this.applyFilter(); // Refresh the displayed data
        this.snackBar.open(`${newItem.name} added successfully!`, 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  editItem(item: InventoryItem) {
    this.snackBar.open(`Edit item: ${item.name}`, 'Close', { duration: 3000 });
  }

  adjustStock(item: InventoryItem) {
    this.snackBar.open(`Adjust stock for: ${item.name}`, 'Close', { duration: 3000 });
  }

  viewHistory(item: InventoryItem) {
    this.snackBar.open(`View history for: ${item.name}`, 'Close', { duration: 3000 });
  }

  deleteItem(item: InventoryItem) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      const index = this.inventoryData.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.inventoryData.splice(index, 1);
        this.applyFilter();
        this.snackBar.open(`${item.name} deleted successfully`, 'Close', { duration: 3000 });
      }
    }
  }

  exportData() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  bulkEdit() {
    this.snackBar.open(`Bulk edit ${this.selection.selected.length} items`, 'Close', { duration: 3000 });
  }

  bulkExport() {
    this.snackBar.open(`Export ${this.selection.selected.length} items`, 'Close', { duration: 3000 });
  }

  bulkDelete() {
    if (confirm(`Are you sure you want to delete ${this.selection.selected.length} items?`)) {
      const selectedIds = this.selection.selected.map(item => item.id);
      this.inventoryData = this.inventoryData.filter(item => !selectedIds.includes(item.id));
      this.selection.clear();
      this.applyFilter();
      this.snackBar.open(`${selectedIds.length} items deleted successfully`, 'Close', { duration: 3000 });
    }
  }
}
