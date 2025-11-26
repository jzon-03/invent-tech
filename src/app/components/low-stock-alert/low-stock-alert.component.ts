import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

// Interface definitions
export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  unitCost: number;
  reorderQuantity: number;
  preferredSupplier: string;
  leadTime: number;
  location: string;
  severity: 'out-of-stock' | 'critical' | 'low' | 'reorder';
  lastUpdated: Date;
  averageDailySales: number;
  daysStockLeft: number;
}

@Component({
  selector: 'app-low-stock-alert',
  templateUrl: './low-stock-alert.component.html',
  styleUrls: ['./low-stock-alert.component.css']
})
export class LowStockAlertComponent implements OnInit {
  // Data properties
  lowStockItems: LowStockItem[] = [
    {
      id: '1',
      name: 'Widget Pro',
      sku: 'WDG-PRO-001',
      category: 'Widgets',
      currentStock: 0,
      reorderPoint: 25,
      minimumStock: 10,
      maximumStock: 200,
      unit: 'pcs',
      unitCost: 15.99,
      reorderQuantity: 100,
      preferredSupplier: 'TechCorp Inc.',
      leadTime: 7,
      location: 'A-1-01',
      severity: 'out-of-stock',
      lastUpdated: new Date(),
      averageDailySales: 3.5,
      daysStockLeft: 0
    },
    {
      id: '2',
      name: 'Smart Sensor',
      sku: 'SNS-SMT-002',
      category: 'Electronics',
      currentStock: 3,
      reorderPoint: 20,
      minimumStock: 8,
      maximumStock: 150,
      unit: 'pcs',
      unitCost: 89.99,
      reorderQuantity: 50,
      preferredSupplier: 'ElectroTech Ltd.',
      leadTime: 14,
      location: 'B-2-15',
      severity: 'critical',
      lastUpdated: new Date(),
      averageDailySales: 1.2,
      daysStockLeft: 2.5
    },
    {
      id: '3',
      name: 'Power Adapter',
      sku: 'PWR-ADP-003',
      category: 'Electronics',
      currentStock: 12,
      reorderPoint: 30,
      minimumStock: 15,
      maximumStock: 300,
      unit: 'pcs',
      unitCost: 24.99,
      reorderQuantity: 80,
      preferredSupplier: 'PowerSolutions',
      leadTime: 5,
      location: 'C-3-08',
      severity: 'low',
      lastUpdated: new Date(),
      averageDailySales: 2.8,
      daysStockLeft: 4.3
    },
    {
      id: '4',
      name: 'USB Cable',
      sku: 'USB-CBL-004',
      category: 'Accessories',
      currentStock: 18,
      reorderPoint: 40,
      minimumStock: 20,
      maximumStock: 500,
      unit: 'pcs',
      unitCost: 8.99,
      reorderQuantity: 200,
      preferredSupplier: 'CableTech Pro',
      leadTime: 3,
      location: 'D-1-22',
      severity: 'reorder',
      lastUpdated: new Date(),
      averageDailySales: 5.2,
      daysStockLeft: 3.5
    },
    {
      id: '5',
      name: 'Memory Card 32GB',
      sku: 'MEM-32G-005',
      category: 'Storage',
      currentStock: 0,
      reorderPoint: 50,
      minimumStock: 25,
      maximumStock: 400,
      unit: 'pcs',
      unitCost: 19.99,
      reorderQuantity: 100,
      preferredSupplier: 'MemoryTech',
      leadTime: 10,
      location: 'E-2-11',
      severity: 'out-of-stock',
      lastUpdated: new Date(),
      averageDailySales: 4.1,
      daysStockLeft: 0
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      sku: 'BLU-SPK-006',
      category: 'Audio',
      currentStock: 4,
      reorderPoint: 15,
      minimumStock: 5,
      maximumStock: 100,
      unit: 'pcs',
      unitCost: 45.99,
      reorderQuantity: 30,
      preferredSupplier: 'AudioMax',
      leadTime: 12,
      location: 'F-3-05',
      severity: 'critical',
      lastUpdated: new Date(),
      averageDailySales: 0.8,
      daysStockLeft: 5.0
    },
    {
      id: '7',
      name: 'Wireless Mouse',
      sku: 'MSE-WRL-007',
      category: 'Peripherals',
      currentStock: 8,
      reorderPoint: 25,
      minimumStock: 12,
      maximumStock: 200,
      unit: 'pcs',
      unitCost: 29.99,
      reorderQuantity: 60,
      preferredSupplier: 'PeripheralPro',
      leadTime: 6,
      location: 'G-1-18',
      severity: 'low',
      lastUpdated: new Date(),
      averageDailySales: 1.5,
      daysStockLeft: 5.3
    },
    {
      id: '8',
      name: 'HDMI Cable 2m',
      sku: 'HDM-CBL-008',
      category: 'Cables',
      currentStock: 22,
      reorderPoint: 35,
      minimumStock: 18,
      maximumStock: 250,
      unit: 'pcs',
      unitCost: 12.99,
      reorderQuantity: 100,
      preferredSupplier: 'CableTech Pro',
      leadTime: 4,
      location: 'H-2-12',
      severity: 'reorder',
      lastUpdated: new Date(),
      averageDailySales: 2.1,
      daysStockLeft: 10.5
    }
  ];

  filteredItems: LowStockItem[] = [];
  
  // Filter properties
  searchTerm: string = '';
  categoryFilter: string = '';
  locationFilter: string = '';
  selectedSeverity: string = '';
  
  // View properties
  viewMode: 'cards' | 'table' = 'cards';
  selection = new SelectionModel<LowStockItem>(true, []);
  
  // Table properties
  displayedColumns: string[] = [
    'select', 'item', 'severity', 'currentStock', 'thresholds', 
    'supplier', 'cost', 'location', 'actions'
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  // Summary calculation methods
  getCriticalStockCount(): number {
    return this.lowStockItems.filter(item => 
      item.severity === 'critical' || item.severity === 'out-of-stock'
    ).length;
  }

  getCriticalStockValue(): number {
    return this.lowStockItems
      .filter(item => item.severity === 'critical' || item.severity === 'out-of-stock')
      .reduce((total, item) => total + (item.currentStock * item.unitCost), 0);
  }

  getLowStockCount(): number {
    return this.lowStockItems.filter(item => item.severity === 'low').length;
  }

  getLowStockValue(): number {
    return this.lowStockItems
      .filter(item => item.severity === 'low')
      .reduce((total, item) => total + (item.currentStock * item.unitCost), 0);
  }

  getReorderCount(): number {
    return this.lowStockItems.filter(item => item.severity === 'reorder').length;
  }

  getPendingOrdersCount(): number {
    // Simulated pending orders
    return Math.floor(this.getReorderCount() * 0.6);
  }

  getOutOfStockCount(): number {
    return this.lowStockItems.filter(item => item.severity === 'out-of-stock').length;
  }

  getStockoutDays(): number {
    const outOfStockItems = this.lowStockItems.filter(item => item.severity === 'out-of-stock');
    return outOfStockItems.length > 0 ? 3.2 : 0; // Simulated average
  }

  getAllItemsCount(): number {
    return this.lowStockItems.length;
  }

  // Filter methods
  getUniqueCategories(): string[] {
    return [...new Set(this.lowStockItems.map(item => item.category))].sort();
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.lowStockItems.map(item => item.location))].sort();
  }

  applyFilter(): void {
    this.filteredItems = this.lowStockItems.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.categoryFilter || item.category === this.categoryFilter;
      const matchesLocation = !this.locationFilter || item.location === this.locationFilter;
      const matchesSeverity = !this.selectedSeverity || item.severity === this.selectedSeverity;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesSeverity;
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.locationFilter = '';
    this.selectedSeverity = '';
    this.applyFilter();
  }

  getFilteredItems(): LowStockItem[] {
    return this.filteredItems;
  }

  // Item helper methods
  getItemCardClass(item: LowStockItem): string {
    return `severity-${item.severity}`;
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'out-of-stock': return 'remove_shopping_cart';
      case 'critical': return 'error';
      case 'low': return 'warning';
      case 'reorder': return 'shopping_cart';
      default: return 'info';
    }
  }

  getStockValueClass(current: number, reorderPoint: number): string {
    if (current === 0) return 'stock-zero';
    if (current <= reorderPoint * 0.3) return 'stock-critical';
    if (current <= reorderPoint * 0.6) return 'stock-low';
    return 'stock-normal';
  }

  getStockPercentage(item: LowStockItem): number {
    if (item.maximumStock === 0) return 0;
    return Math.round((item.currentStock / item.maximumStock) * 100);
  }

  getProgressColor(item: LowStockItem): 'primary' | 'accent' | 'warn' {
    const percentage = this.getStockPercentage(item);
    if (percentage <= 20) return 'warn';
    if (percentage <= 50) return 'accent';
    return 'primary';
  }

  getReorderCost(item: LowStockItem): number {
    return item.reorderQuantity * item.unitCost;
  }

  // Selection methods
  toggleSelection(item: LowStockItem): void {
    this.selection.toggle(item);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredItems.length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.filteredItems);
  }

  // Action methods
  createPurchaseOrder(): void {
    this.snackBar.open('Creating purchase order for all low stock items...', 'Close', {
      duration: 3000
    });
  }

  createOrder(item: LowStockItem): void {
    this.snackBar.open(`Creating order for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }

  updateThresholds(): void {
    this.snackBar.open('Opening threshold update dialog...', 'Close', {
      duration: 3000
    });
  }

  updateThreshold(item: LowStockItem): void {
    this.snackBar.open(`Updating threshold for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }

  exportAlerts(): void {
    this.snackBar.open('Exporting alerts to CSV...', 'Close', {
      duration: 3000
    });
  }

  bulkOrder(): void {
    this.snackBar.open('Creating bulk order...', 'Close', {
      duration: 3000
    });
  }

  configureAlerts(): void {
    this.snackBar.open('Opening alert configuration...', 'Close', {
      duration: 3000
    });
  }

  bulkCreateOrder(): void {
    const selectedCount = this.selection.selected.length;
    this.snackBar.open(`Creating orders for ${selectedCount} selected items...`, 'Close', {
      duration: 3000
    });
    this.selection.clear();
  }

  bulkUpdateThreshold(): void {
    const selectedCount = this.selection.selected.length;
    this.snackBar.open(`Updating thresholds for ${selectedCount} selected items...`, 'Close', {
      duration: 3000
    });
    this.selection.clear();
  }

  viewHistory(item: LowStockItem): void {
    this.snackBar.open(`Viewing stock history for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }

  adjustStock(item: LowStockItem): void {
    this.snackBar.open(`Adjusting stock for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }

  changeSupplier(item: LowStockItem): void {
    this.snackBar.open(`Changing supplier for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }

  viewDetails(item: LowStockItem): void {
    this.snackBar.open(`Viewing details for ${item.name}...`, 'Close', {
      duration: 3000
    });
  }
}
