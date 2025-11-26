import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  poNumber: string;
  supplier: string;
  supplierContact: string;
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  trackingNumber?: string;
  notes?: string;
  createdBy: string;
  lastUpdated: Date;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['select', 'poNumber', 'supplier', 'orderDate', 'items', 'total', 'status', 'expectedDelivery', 'actions'];
  selection = new SelectionModel<Order>(true, []);
  
  searchTerm = '';
  statusFilter = '';
  supplierFilter = '';
  dateFilter = '';
  quickFilter = '';
  viewMode = 'cards';
  
  // Sample orders data
  orders: Order[] = [
    {
      id: 1,
      poNumber: 'PO-2024-001',
      supplier: 'TechFlow Solutions',
      supplierContact: 'john@techflow.com',
      orderDate: new Date('2024-11-20'),
      expectedDelivery: new Date('2024-11-27'),
      status: 'shipped',
      trackingNumber: 'TF123456789',
      items: [
        { id: 1, name: 'Wireless Headphones', quantity: 50, unitPrice: 99.99, totalPrice: 4999.50 },
        { id: 2, name: 'Bluetooth Speakers', quantity: 25, unitPrice: 149.99, totalPrice: 3749.75 }
      ],
      totalAmount: 8749.25,
      createdBy: 'Admin User',
      lastUpdated: new Date()
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      supplier: 'Global Electronics Ltd',
      supplierContact: 'sarah@globalelec.com',
      orderDate: new Date('2024-11-18'),
      expectedDelivery: new Date('2024-11-25'),
      status: 'delivered',
      actualDelivery: new Date('2024-11-24'),
      trackingNumber: 'GE987654321',
      items: [
        { id: 3, name: 'Smartphone Cases', quantity: 100, unitPrice: 24.99, totalPrice: 2499.00 },
        { id: 4, name: 'Screen Protectors', quantity: 200, unitPrice: 9.99, totalPrice: 1998.00 }
      ],
      totalAmount: 4497.00,
      createdBy: 'Jane Smith',
      lastUpdated: new Date()
    },
    {
      id: 3,
      poNumber: 'PO-2024-003',
      supplier: 'Pacific Supplies Co.',
      supplierContact: 'michael@pacificsupplies.com',
      orderDate: new Date('2024-11-15'),
      expectedDelivery: new Date('2024-11-22'),
      status: 'confirmed',
      items: [
        { id: 5, name: 'Laptop Chargers', quantity: 30, unitPrice: 49.99, totalPrice: 1499.70 },
        { id: 6, name: 'USB Cables', quantity: 100, unitPrice: 12.99, totalPrice: 1299.00 }
      ],
      totalAmount: 2798.70,
      createdBy: 'Mike Johnson',
      lastUpdated: new Date()
    },
    {
      id: 4,
      poNumber: 'PO-2024-004',
      supplier: 'Modern Manufacturing',
      supplierContact: 'emma@modernmfg.com',
      orderDate: new Date('2024-11-10'),
      expectedDelivery: new Date('2024-11-17'),
      status: 'cancelled',
      items: [
        { id: 7, name: 'Office Chairs', quantity: 15, unitPrice: 299.99, totalPrice: 4499.85 }
      ],
      totalAmount: 4499.85,
      createdBy: 'Admin User',
      lastUpdated: new Date()
    },
    {
      id: 5,
      poNumber: 'PO-2024-005',
      supplier: 'Southwest Distribution',
      supplierContact: 'david@swdist.com',
      orderDate: new Date('2024-11-25'),
      expectedDelivery: new Date('2024-12-02'),
      status: 'pending',
      items: [
        { id: 8, name: 'Cotton T-Shirts', quantity: 200, unitPrice: 19.99, totalPrice: 3998.00 },
        { id: 9, name: 'Denim Jeans', quantity: 50, unitPrice: 59.99, totalPrice: 2999.50 }
      ],
      totalAmount: 6997.50,
      createdBy: 'Sarah Wilson',
      lastUpdated: new Date()
    },
    {
      id: 6,
      poNumber: 'PO-2024-006',
      supplier: 'Atlantic Components',
      supplierContact: 'robert@atlanticcomp.com',
      orderDate: new Date('2024-11-12'),
      expectedDelivery: new Date('2024-11-19'),
      status: 'shipped',
      trackingNumber: 'AC456789123',
      items: [
        { id: 10, name: 'Coffee Makers', quantity: 20, unitPrice: 89.99, totalPrice: 1799.80 },
        { id: 11, name: 'Blenders', quantity: 15, unitPrice: 79.99, totalPrice: 1199.85 }
      ],
      totalAmount: 2999.65,
      createdBy: 'Tom Brown',
      lastUpdated: new Date()
    },
    {
      id: 7,
      poNumber: 'PO-2024-007',
      supplier: 'Mountain View Supplies',
      supplierContact: 'jennifer@mvs.com',
      orderDate: new Date('2024-10-28'),
      expectedDelivery: new Date('2024-11-05'),
      status: 'delivered',
      actualDelivery: new Date('2024-11-03'),
      trackingNumber: 'MV789123456',
      items: [
        { id: 12, name: 'Yoga Mats', quantity: 40, unitPrice: 34.99, totalPrice: 1399.60 },
        { id: 13, name: 'Water Bottles', quantity: 80, unitPrice: 29.99, totalPrice: 2399.20 }
      ],
      totalAmount: 3798.80,
      createdBy: 'Lisa Davis',
      lastUpdated: new Date()
    },
    {
      id: 8,
      poNumber: 'PO-2024-008',
      supplier: 'Northern Logistics',
      supplierContact: 'lisa@northernlog.com',
      orderDate: new Date('2024-11-22'),
      expectedDelivery: new Date('2024-11-15'),
      status: 'pending',
      items: [
        { id: 14, name: 'Desk Lamps', quantity: 25, unitPrice: 45.99, totalPrice: 1149.75 },
        { id: 15, name: 'Keyboards', quantity: 30, unitPrice: 89.99, totalPrice: 2699.70 }
      ],
      totalAmount: 3849.45,
      createdBy: 'Chris Wilson',
      lastUpdated: new Date()
    }
  ];

  filteredOrders: Order[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredOrders = [...this.orders];
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  getThisMonthOrders(): number {
    const thisMonth = new Date().getMonth();
    return this.orders.filter(order => order.orderDate.getMonth() === thisMonth).length;
  }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  getTotalValue(): number {
    return this.orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  getOverdueOrders(): number {
    const today = new Date();
    return this.orders.filter(order => 
      order.expectedDelivery && 
      order.expectedDelivery < today && 
      order.status !== 'delivered' && 
      order.status !== 'cancelled'
    ).length;
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  setQuickFilter(status: string) {
    this.quickFilter = status;
    this.statusFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.poNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.supplier.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      const matchesSupplier = !this.supplierFilter || order.supplier === this.supplierFilter;
      const matchesDate = this.matchesDateFilter(order);
      
      return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
    });
  }

  matchesDateFilter(order: Order): boolean {
    if (!this.dateFilter) return true;
    
    const today = new Date();
    const orderDate = order.orderDate;
    
    switch (this.dateFilter) {
      case 'today':
        return orderDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      case 'month':
        return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        const orderQuarter = Math.floor(orderDate.getMonth() / 3);
        return orderQuarter === quarter && orderDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.supplierFilter = '';
    this.dateFilter = '';
    this.quickFilter = '';
    this.applyFilter();
  }

  getFilteredOrders(): Order[] {
    return this.filteredOrders;
  }

  getUniqueSuppliers(): string[] {
    return [...new Set(this.orders.map(order => order.supplier))].sort();
  }

  getOrderCardClass(order: Order): string {
    return `order-card-${order.status}`;
  }

  getStatusChipClass(status: string): string {
    return `status-chip-${status}`;
  }

  getOrderProgress(status: string): number {
    const progressMap = {
      'pending': 20,
      'confirmed': 40,
      'shipped': 70,
      'delivered': 100,
      'cancelled': 0
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  }

  getProgressColor(status: string): string {
    return status === 'cancelled' ? 'warn' : 'primary';
  }

  getProgressLabel(status: string): string {
    const labelMap = {
      'pending': 'Awaiting confirmation',
      'confirmed': 'Processing order',
      'shipped': 'In transit',
      'delivered': 'Delivered successfully',
      'cancelled': 'Order cancelled'
    };
    return labelMap[status as keyof typeof labelMap] || status;
  }

  isOverdue(expectedDelivery?: Date): boolean {
    if (!expectedDelivery) return false;
    return expectedDelivery < new Date();
  }

  selectOrder(order: Order) {
    this.selection.toggle(order);
  }

  toggleSelection(order: Order) {
    this.selection.toggle(order);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredOrders.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.filteredOrders);
  }

  openCreateOrderDialog() {
    this.snackBar.open('Create Order dialog will be implemented', 'Close', { duration: 3000 });
  }

  viewOrder(order: Order) {
    this.snackBar.open(`View order: ${order.poNumber}`, 'Close', { duration: 3000 });
  }

  editOrder(order: Order) {
    this.snackBar.open(`Edit order: ${order.poNumber}`, 'Close', { duration: 3000 });
  }

  printPO(order: Order) {
    this.snackBar.open(`Print PO: ${order.poNumber}`, 'Close', { duration: 3000 });
  }

  trackOrder(order: Order) {
    if (order.trackingNumber) {
      this.snackBar.open(`Track package: ${order.trackingNumber}`, 'Close', { duration: 3000 });
    }
  }

  duplicateOrder(order: Order) {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      poNumber: `PO-2024-${String(this.orders.length + 1).padStart(3, '0')}`,
      orderDate: new Date(),
      status: 'pending',
      trackingNumber: undefined,
      actualDelivery: undefined,
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      lastUpdated: new Date()
    };
    
    this.orders.push(newOrder);
    this.applyFilter();
    this.snackBar.open(`${order.poNumber} duplicated successfully`, 'Close', { duration: 3000 });
  }

  updateStatus(order: Order, newStatus: 'confirmed' | 'shipped' | 'delivered') {
    order.status = newStatus;
    order.lastUpdated = new Date();
    
    if (newStatus === 'delivered') {
      order.actualDelivery = new Date();
    }
    
    this.snackBar.open(`${order.poNumber} marked as ${newStatus}`, 'Close', { duration: 3000 });
  }

  cancelOrder(order: Order) {
    if (confirm(`Are you sure you want to cancel order ${order.poNumber}?`)) {
      order.status = 'cancelled';
      order.lastUpdated = new Date();
      this.snackBar.open(`${order.poNumber} cancelled successfully`, 'Close', { duration: 3000 });
    }
  }

  exportOrders() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  importOrders() {
    this.snackBar.open('Import functionality will be implemented', 'Close', { duration: 3000 });
  }

  generatePOReport() {
    this.snackBar.open('PO Report generation will be implemented', 'Close', { duration: 3000 });
  }

  bulkConfirm() {
    const pendingOrders = this.selection.selected.filter(order => order.status === 'pending');
    pendingOrders.forEach(order => {
      order.status = 'confirmed';
      order.lastUpdated = new Date();
    });
    
    this.selection.clear();
    this.snackBar.open(`${pendingOrders.length} orders confirmed`, 'Close', { duration: 3000 });
  }

  bulkPrint() {
    this.snackBar.open(`Print ${this.selection.selected.length} POs`, 'Close', { duration: 3000 });
    this.selection.clear();
  }

  bulkExport() {
    this.snackBar.open(`Export ${this.selection.selected.length} orders`, 'Close', { duration: 3000 });
    this.selection.clear();
  }

  bulkCancel() {
    const cancellableOrders = this.selection.selected.filter(order => 
      order.status !== 'delivered' && order.status !== 'cancelled'
    );
    
    if (cancellableOrders.length === 0) {
      this.snackBar.open('No orders can be cancelled', 'Close', { duration: 3000 });
      return;
    }
    
    if (confirm(`Are you sure you want to cancel ${cancellableOrders.length} orders?`)) {
      cancellableOrders.forEach(order => {
        order.status = 'cancelled';
        order.lastUpdated = new Date();
      });
      
      this.selection.clear();
      this.snackBar.open(`${cancellableOrders.length} orders cancelled`, 'Close', { duration: 3000 });
    }
  }
}
