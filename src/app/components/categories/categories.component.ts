import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  itemCount: number;
  totalValue: number;
  createdDate: Date;
  lastUpdated: Date;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['select', 'icon', 'name', 'items', 'value', 'status', 'created', 'actions'];
  selection = new SelectionModel<Category>(true, []);
  
  searchTerm = '';
  sortBy = 'name';
  statusFilter = '';
  viewMode = 'grid';
  
  // Sample categories data
  categories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices, gadgets, and accessories',
      icon: 'devices',
      color: '#2196f3',
      isActive: true,
      itemCount: 45,
      totalValue: 12750.50,
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Apparel, footwear, and fashion accessories',
      icon: 'checkroom',
      color: '#9c27b0',
      isActive: true,
      itemCount: 78,
      totalValue: 8920.25,
      createdDate: new Date('2024-01-20'),
      lastUpdated: new Date()
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Home improvement, furniture, and gardening supplies',
      icon: 'home',
      color: '#4caf50',
      isActive: true,
      itemCount: 32,
      totalValue: 5640.75,
      createdDate: new Date('2024-02-01'),
      lastUpdated: new Date()
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Sports equipment, fitness gear, and outdoor activities',
      icon: 'sports_soccer',
      color: '#ff9800',
      isActive: true,
      itemCount: 25,
      totalValue: 3420.00,
      createdDate: new Date('2024-02-10'),
      lastUpdated: new Date()
    },
    {
      id: 5,
      name: 'Books',
      description: 'Books, e-books, and educational materials',
      icon: 'menu_book',
      color: '#795548',
      isActive: true,
      itemCount: 156,
      totalValue: 2890.40,
      createdDate: new Date('2024-02-15'),
      lastUpdated: new Date()
    },
    {
      id: 6,
      name: 'Toys',
      description: 'Children toys, games, and educational toys',
      icon: 'toys',
      color: '#e91e63',
      isActive: true,
      itemCount: 67,
      totalValue: 4250.80,
      createdDate: new Date('2024-02-20'),
      lastUpdated: new Date()
    },
    {
      id: 7,
      name: 'Beauty & Health',
      description: 'Cosmetics, skincare, and health products',
      icon: 'spa',
      color: '#673ab7',
      isActive: false,
      itemCount: 0,
      totalValue: 0,
      createdDate: new Date('2024-03-01'),
      lastUpdated: new Date()
    },
    {
      id: 8,
      name: 'Automotive',
      description: 'Car parts, accessories, and maintenance supplies',
      icon: 'directions_car',
      color: '#607d8b',
      isActive: true,
      itemCount: 18,
      totalValue: 1850.30,
      createdDate: new Date('2024-03-05'),
      lastUpdated: new Date()
    }
  ];

  filteredCategories: Category[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredCategories = [...this.categories];
    this.applySorting();
  }

  getTotalCategories(): number {
    return this.categories.filter(cat => cat.isActive).length;
  }

  getTotalItems(): number {
    return this.categories.reduce((total, cat) => total + cat.itemCount, 0);
  }

  getMostPopularCategory(): string {
    const mostPopular = this.categories.reduce((prev, current) => 
      (prev.itemCount > current.itemCount) ? prev : current
    );
    return mostPopular.name;
  }

  getEmptyCategories(): number {
    return this.categories.filter(cat => cat.itemCount === 0).length;
  }

  applyFilter() {
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = !this.searchTerm || 
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter ||
        (this.statusFilter === 'active' && category.isActive) ||
        (this.statusFilter === 'inactive' && !category.isActive) ||
        (this.statusFilter === 'empty' && category.itemCount === 0);
      
      return matchesSearch && matchesStatus;
    });
    
    this.applySorting();
  }

  applySorting() {
    this.filteredCategories.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'items':
          return b.itemCount - a.itemCount;
        case 'created':
          return b.createdDate.getTime() - a.createdDate.getTime();
        default:
          return 0;
      }
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.sortBy = 'name';
    this.applyFilter();
  }

  getFilteredCategories(): Category[] {
    return this.filteredCategories;
  }

  getCategoryStatus(category: Category): string {
    if (!category.isActive) return 'Inactive';
    if (category.itemCount === 0) return 'Empty';
    return 'Active';
  }

  getCategoryStatusClass(category: Category): string {
    if (!category.isActive) return 'status-chip-inactive';
    if (category.itemCount === 0) return 'status-chip-empty';
    return 'status-chip-active';
  }

  selectCategory(category: Category) {
    this.selection.toggle(category);
  }

  toggleSelection(category: Category) {
    this.selection.toggle(category);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredCategories.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.filteredCategories);
  }

  openAddDialog() {
    this.snackBar.open('Add Category dialog will be implemented', 'Close', { duration: 3000 });
  }

  editCategory(category: Category) {
    this.snackBar.open(`Edit category: ${category.name}`, 'Close', { duration: 3000 });
  }

  viewCategoryItems(category: Category) {
    this.snackBar.open(`View items in: ${category.name}`, 'Close', { duration: 3000 });
  }

  duplicateCategory(category: Category) {
    const newCategory: Category = {
      ...category,
      id: Date.now(),
      name: `${category.name} (Copy)`,
      itemCount: 0,
      totalValue: 0,
      createdDate: new Date(),
      lastUpdated: new Date()
    };
    
    this.categories.push(newCategory);
    this.applyFilter();
    this.snackBar.open(`${category.name} duplicated successfully`, 'Close', { duration: 3000 });
  }

  toggleCategoryStatus(category: Category) {
    category.isActive = !category.isActive;
    category.lastUpdated = new Date();
    this.applyFilter();
    
    const status = category.isActive ? 'activated' : 'deactivated';
    this.snackBar.open(`${category.name} ${status} successfully`, 'Close', { duration: 3000 });
  }

  deleteCategory(category: Category) {
    if (category.itemCount > 0) {
      this.snackBar.open(`Cannot delete ${category.name}. It contains ${category.itemCount} items.`, 'Close', { duration: 5000 });
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      const index = this.categories.findIndex(c => c.id === category.id);
      if (index > -1) {
        this.categories.splice(index, 1);
        this.selection.deselect(category);
        this.applyFilter();
        this.snackBar.open(`${category.name} deleted successfully`, 'Close', { duration: 3000 });
      }
    }
  }

  exportCategories() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  importCategories() {
    this.snackBar.open('Import functionality will be implemented', 'Close', { duration: 3000 });
  }

  bulkActivate() {
    this.selection.selected.forEach(category => {
      category.isActive = true;
      category.lastUpdated = new Date();
    });
    
    this.applyFilter();
    this.selection.clear();
    this.snackBar.open('Selected categories activated', 'Close', { duration: 3000 });
  }

  bulkDeactivate() {
    this.selection.selected.forEach(category => {
      category.isActive = false;
      category.lastUpdated = new Date();
    });
    
    this.applyFilter();
    this.selection.clear();
    this.snackBar.open('Selected categories deactivated', 'Close', { duration: 3000 });
  }

  bulkDelete() {
    const categoriesWithItems = this.selection.selected.filter(cat => cat.itemCount > 0);
    
    if (categoriesWithItems.length > 0) {
      this.snackBar.open(`Cannot delete categories that contain items`, 'Close', { duration: 5000 });
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${this.selection.selected.length} categories?`)) {
      const selectedIds = this.selection.selected.map(cat => cat.id);
      this.categories = this.categories.filter(cat => !selectedIds.includes(cat.id));
      this.selection.clear();
      this.applyFilter();
      this.snackBar.open(`${selectedIds.length} categories deleted successfully`, 'Close', { duration: 3000 });
    }
  }
}
