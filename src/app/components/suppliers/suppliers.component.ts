import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

export interface Supplier {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date;
  isPrimary: boolean;
  isVerified: boolean;
  createdDate: Date;
  lastUpdated: Date;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['select', 'supplier', 'contact', 'location', 'orders', 'rating', 'spent', 'status', 'lastOrder', 'actions'];
  selection = new SelectionModel<Supplier>(true, []);
  
  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';
  sortBy = 'name';
  viewMode = 'cards';
  
  // Sample suppliers data
  suppliers: Supplier[] = [
    {
      id: 1,
      name: 'John Smith',
      company: 'TechFlow Solutions',
      email: 'john@techflow.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      status: 'active',
      rating: 4.8,
      orderCount: 45,
      totalSpent: 125000,
      lastOrderDate: new Date('2024-11-20'),
      isPrimary: true,
      isVerified: true,
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Global Electronics Ltd',
      email: 'sarah@globalelec.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      status: 'active',
      rating: 4.6,
      orderCount: 32,
      totalSpent: 89500,
      lastOrderDate: new Date('2024-11-18'),
      isPrimary: false,
      isVerified: true,
      createdDate: new Date('2024-02-01'),
      lastUpdated: new Date()
    },
    {
      id: 3,
      name: 'Michael Chen',
      company: 'Pacific Supplies Co.',
      email: 'michael@pacificsupplies.com',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      status: 'active',
      rating: 4.9,
      orderCount: 28,
      totalSpent: 67300,
      lastOrderDate: new Date('2024-11-15'),
      isPrimary: false,
      isVerified: true,
      createdDate: new Date('2024-02-10'),
      lastUpdated: new Date()
    },
    {
      id: 4,
      name: 'Emma Williams',
      company: 'Modern Manufacturing',
      email: 'emma@modernmfg.com',
      phone: '+1 (555) 234-5678',
      location: 'Chicago, IL',
      status: 'inactive',
      rating: 4.2,
      orderCount: 15,
      totalSpent: 42800,
      lastOrderDate: new Date('2024-10-05'),
      isPrimary: false,
      isVerified: false,
      createdDate: new Date('2024-03-01'),
      lastUpdated: new Date()
    },
    {
      id: 5,
      name: 'David Rodriguez',
      company: 'Southwest Distribution',
      email: 'david@swdist.com',
      phone: '+1 (555) 345-6789',
      location: 'Phoenix, AZ',
      status: 'active',
      rating: 4.4,
      orderCount: 22,
      totalSpent: 55600,
      lastOrderDate: new Date('2024-11-12'),
      isPrimary: false,
      isVerified: true,
      createdDate: new Date('2024-03-15'),
      lastUpdated: new Date()
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      company: 'Northern Logistics',
      email: 'lisa@northernlog.com',
      phone: '+1 (555) 567-8901',
      location: 'Seattle, WA',
      status: 'pending',
      rating: 3.8,
      orderCount: 8,
      totalSpent: 18900,
      lastOrderDate: new Date('2024-11-10'),
      isPrimary: false,
      isVerified: false,
      createdDate: new Date('2024-04-01'),
      lastUpdated: new Date()
    },
    {
      id: 7,
      name: 'Robert Taylor',
      company: 'Atlantic Components',
      email: 'robert@atlanticcomp.com',
      phone: '+1 (555) 678-9012',
      location: 'Miami, FL',
      status: 'active',
      rating: 4.7,
      orderCount: 38,
      totalSpent: 94200,
      lastOrderDate: new Date('2024-11-22'),
      isPrimary: true,
      isVerified: true,
      createdDate: new Date('2024-04-15'),
      lastUpdated: new Date()
    },
    {
      id: 8,
      name: 'Jennifer Brown',
      company: 'Mountain View Supplies',
      email: 'jennifer@mvs.com',
      phone: '+1 (555) 789-0123',
      location: 'Denver, CO',
      status: 'active',
      rating: 4.3,
      orderCount: 19,
      totalSpent: 47800,
      lastOrderDate: new Date('2024-11-08'),
      isPrimary: false,
      isVerified: true,
      createdDate: new Date('2024-05-01'),
      lastUpdated: new Date()
    }
  ];

  filteredSuppliers: Supplier[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredSuppliers = [...this.suppliers];
    this.applySorting();
  }

  getTotalSuppliers(): number {
    return this.suppliers.length;
  }

  getActiveSuppliers(): number {
    return this.suppliers.filter(s => s.status === 'active').length;
  }

  getTotalOrders(): number {
    return this.suppliers.reduce((total, s) => total + s.orderCount, 0);
  }

  getTotalSpent(): number {
    return this.suppliers.reduce((total, s) => total + s.totalSpent, 0);
  }

  getTopRatedSupplier(): string {
    const topSupplier = this.suppliers.reduce((prev, current) => 
      (prev.rating > current.rating) ? prev : current
    );
    return topSupplier.name;
  }

  getTopRating(): number {
    return Math.max(...this.suppliers.map(s => s.rating));
  }

  applyFilter() {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const matchesSearch = !this.searchTerm || 
        supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || supplier.status === this.statusFilter;
      
      const matchesRating = !this.ratingFilter || supplier.rating >= parseFloat(this.ratingFilter);
      
      return matchesSearch && matchesStatus && matchesRating;
    });
    
    this.applySorting();
  }

  applySorting() {
    this.filteredSuppliers.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'rating':
          return b.rating - a.rating;
        case 'orders':
          return b.orderCount - a.orderCount;
        case 'lastOrder':
          return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
        default:
          return 0;
      }
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.ratingFilter = '';
    this.sortBy = 'name';
    this.applyFilter();
  }

  getFilteredSuppliers(): Supplier[] {
    return this.filteredSuppliers;
  }

  getSupplierColor(name: string): string {
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#795548', '#607d8b', '#e91e63'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  getSupplierInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusChipClass(status: string): string {
    return `status-chip-${status}`;
  }

  selectSupplier(supplier: Supplier) {
    this.selection.toggle(supplier);
  }

  toggleSelection(supplier: Supplier) {
    this.selection.toggle(supplier);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredSuppliers.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.filteredSuppliers);
  }

  openAddDialog() {
    this.snackBar.open('Add Supplier dialog will be implemented', 'Close', { duration: 3000 });
  }

  editSupplier(supplier: Supplier) {
    this.snackBar.open(`Edit supplier: ${supplier.name}`, 'Close', { duration: 3000 });
  }

  viewOrders(supplier: Supplier) {
    this.snackBar.open(`View orders for: ${supplier.name}`, 'Close', { duration: 3000 });
  }

  contactSupplier(supplier: Supplier) {
    this.snackBar.open(`Contact supplier: ${supplier.name}`, 'Close', { duration: 3000 });
  }

  rateSupplier(supplier: Supplier) {
    this.snackBar.open(`Rate supplier: ${supplier.name}`, 'Close', { duration: 3000 });
  }

  duplicateSupplier(supplier: Supplier) {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now(),
      name: `${supplier.name} (Copy)`,
      email: `copy.${supplier.email}`,
      orderCount: 0,
      totalSpent: 0,
      lastOrderDate: new Date(),
      isPrimary: false,
      createdDate: new Date(),
      lastUpdated: new Date()
    };
    
    this.suppliers.push(newSupplier);
    this.applyFilter();
    this.snackBar.open(`${supplier.name} duplicated successfully`, 'Close', { duration: 3000 });
  }

  toggleSupplierStatus(supplier: Supplier) {
    supplier.status = supplier.status === 'active' ? 'inactive' : 'active';
    supplier.lastUpdated = new Date();
    this.applyFilter();
    
    const status = supplier.status === 'active' ? 'activated' : 'deactivated';
    this.snackBar.open(`${supplier.name} ${status} successfully`, 'Close', { duration: 3000 });
  }

  deleteSupplier(supplier: Supplier) {
    if (confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      const index = this.suppliers.findIndex(s => s.id === supplier.id);
      if (index > -1) {
        this.suppliers.splice(index, 1);
        this.selection.deselect(supplier);
        this.applyFilter();
        this.snackBar.open(`${supplier.name} deleted successfully`, 'Close', { duration: 3000 });
      }
    }
  }

  exportSuppliers() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  importSuppliers() {
    this.snackBar.open('Import functionality will be implemented', 'Close', { duration: 3000 });
  }

  generateReport() {
    this.snackBar.open('Report generation will be implemented', 'Close', { duration: 3000 });
  }

  bulkActivate() {
    this.selection.selected.forEach(supplier => {
      supplier.status = 'active';
      supplier.lastUpdated = new Date();
    });
    
    this.applyFilter();
    this.selection.clear();
    this.snackBar.open('Selected suppliers activated', 'Close', { duration: 3000 });
  }

  bulkDeactivate() {
    this.selection.selected.forEach(supplier => {
      supplier.status = 'inactive';
      supplier.lastUpdated = new Date();
    });
    
    this.applyFilter();
    this.selection.clear();
    this.snackBar.open('Selected suppliers deactivated', 'Close', { duration: 3000 });
  }

  bulkExport() {
    this.snackBar.open(`Export ${this.selection.selected.length} suppliers`, 'Close', { duration: 3000 });
    this.selection.clear();
  }

  bulkDelete() {
    if (confirm(`Are you sure you want to delete ${this.selection.selected.length} suppliers?`)) {
      const selectedIds = this.selection.selected.map(s => s.id);
      this.suppliers = this.suppliers.filter(s => !selectedIds.includes(s.id));
      this.selection.clear();
      this.applyFilter();
      this.snackBar.open(`${selectedIds.length} suppliers deleted successfully`, 'Close', { duration: 3000 });
    }
  }
}
