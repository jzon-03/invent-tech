import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { RecordMovementDialogComponent } from '../record-movement-dialog/record-movement-dialog.component';

export interface MovementType {
  value: string;
  label: string;
  icon: string;
}

export interface StockMovement {
  id: number;
  itemName: string;
  itemSku: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return' | 'damage' | 'theft';
  quantity: number;
  location: string;
  fromLocation?: string;
  toLocation?: string;
  reference: string;
  reason?: string;
  cost?: number;
  user: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
  approvedBy?: string;
  notes?: string;
}

@Component({
  selector: 'app-stock-movement',
  templateUrl: './stock-movement.component.html',
  styleUrl: './stock-movement.component.css'
})
export class StockMovementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = [
    'timestamp', 'item', 'type', 'quantity', 'location', 'user', 'reference', 'status', 'cost', 'actions'
  ];
  
  searchTerm = '';
  dateFilter = '';
  locationFilter = '';
  userFilter = '';
  statusFilter = '';
  selectedMovementTypes: string[] = [];
  viewMode = 'timeline';
  
  movementTypes: MovementType[] = [
    { value: 'inbound', label: 'Stock In', icon: 'arrow_downward' },
    { value: 'outbound', label: 'Stock Out', icon: 'arrow_upward' },
    { value: 'transfer', label: 'Transfer', icon: 'swap_horiz' },
    { value: 'adjustment', label: 'Adjustment', icon: 'tune' },
    { value: 'return', label: 'Return', icon: 'undo' },
    { value: 'damage', label: 'Damage', icon: 'warning' },
    { value: 'theft', label: 'Theft', icon: 'security' }
  ];
  
  // Sample stock movements data
  movements: StockMovement[] = [
    {
      id: 1,
      itemName: 'Wireless Headphones',
      itemSku: 'WH-1000XM4',
      type: 'inbound',
      quantity: 50,
      location: 'Main Warehouse',
      reference: 'PO-2024-001',
      reason: 'New stock purchase',
      cost: 4999.50,
      user: 'Sarah Wilson',
      timestamp: new Date('2024-11-26T09:30:00'),
      status: 'completed',
      approvedBy: 'Manager Smith'
    },
    {
      id: 2,
      itemName: 'Bluetooth Speakers',
      itemSku: 'BT-SP-200',
      type: 'outbound',
      quantity: 15,
      location: 'Main Warehouse',
      reference: 'SO-2024-045',
      reason: 'Customer order fulfillment',
      cost: 2249.85,
      user: 'Mike Johnson',
      timestamp: new Date('2024-11-26T08:15:00'),
      status: 'completed'
    },
    {
      id: 3,
      itemName: 'Smartphone Cases',
      itemSku: 'SC-IPHONE15',
      type: 'transfer',
      quantity: 25,
      location: 'Store Location A',
      fromLocation: 'Main Warehouse',
      toLocation: 'Store Location A',
      reference: 'TR-2024-012',
      reason: 'Stock replenishment',
      user: 'Lisa Davis',
      timestamp: new Date('2024-11-26T07:45:00'),
      status: 'pending'
    },
    {
      id: 4,
      itemName: 'USB Cables',
      itemSku: 'USB-C-3M',
      type: 'adjustment',
      quantity: -5,
      location: 'Main Warehouse',
      reference: 'ADJ-2024-008',
      reason: 'Physical count discrepancy',
      user: 'Tom Brown',
      timestamp: new Date('2024-11-25T16:20:00'),
      status: 'pending'
    },
    {
      id: 5,
      itemName: 'Laptop Chargers',
      itemSku: 'LC-DELL-90W',
      type: 'return',
      quantity: 3,
      location: 'Returns Area',
      reference: 'RET-2024-156',
      reason: 'Customer return - defective',
      user: 'Emma Wilson',
      timestamp: new Date('2024-11-25T14:30:00'),
      status: 'completed',
      approvedBy: 'Supervisor Jones'
    },
    {
      id: 6,
      itemName: 'Wireless Mouse',
      itemSku: 'WM-LOGI-MX3',
      type: 'damage',
      quantity: -2,
      location: 'Main Warehouse',
      reference: 'DMG-2024-023',
      reason: 'Damaged during handling',
      user: 'Chris Wilson',
      timestamp: new Date('2024-11-25T11:15:00'),
      status: 'completed',
      approvedBy: 'Manager Smith'
    },
    {
      id: 7,
      itemName: 'Gaming Keyboards',
      itemSku: 'GK-MECH-RGB',
      type: 'inbound',
      quantity: 30,
      location: 'Main Warehouse',
      reference: 'PO-2024-002',
      reason: 'Restocking popular item',
      cost: 3899.70,
      user: 'David Kim',
      timestamp: new Date('2024-11-25T10:00:00'),
      status: 'completed',
      approvedBy: 'Purchasing Manager'
    },
    {
      id: 8,
      itemName: 'Tablet Stands',
      itemSku: 'TS-ADJUST-PRO',
      type: 'outbound',
      quantity: 8,
      location: 'Store Location B',
      reference: 'SO-2024-046',
      reason: 'Bulk order shipment',
      cost: 639.92,
      user: 'Jennifer Lee',
      timestamp: new Date('2024-11-24T15:45:00'),
      status: 'completed'
    },
    {
      id: 9,
      itemName: 'Screen Protectors',
      itemSku: 'SP-TEMPERED-9H',
      type: 'transfer',
      quantity: 100,
      location: 'Store Location C',
      fromLocation: 'Main Warehouse',
      toLocation: 'Store Location C',
      reference: 'TR-2024-013',
      reason: 'New store opening stock',
      user: 'Robert Chen',
      timestamp: new Date('2024-11-24T13:20:00'),
      status: 'completed',
      approvedBy: 'Regional Manager'
    },
    {
      id: 10,
      itemName: 'Power Banks',
      itemSku: 'PB-20000MAH',
      type: 'theft',
      quantity: -4,
      location: 'Store Location A',
      reference: 'THEFT-2024-003',
      reason: 'Security incident reported',
      user: 'Security System',
      timestamp: new Date('2024-11-24T12:00:00'),
      status: 'completed',
      approvedBy: 'Security Manager'
    },
    {
      id: 11,
      itemName: 'Wireless Chargers',
      itemSku: 'WC-FAST-15W',
      type: 'adjustment',
      quantity: 2,
      location: 'Main Warehouse',
      reference: 'ADJ-2024-009',
      reason: 'Found additional units during audit',
      user: 'Audit Team',
      timestamp: new Date('2024-11-23T16:30:00'),
      status: 'completed',
      approvedBy: 'Inventory Manager'
    },
    {
      id: 12,
      itemName: 'Bluetooth Earbuds',
      itemSku: 'BE-AIRPODS-PRO',
      type: 'inbound',
      quantity: 40,
      location: 'Main Warehouse',
      reference: 'PO-2024-003',
      reason: 'Pre-holiday stock increase',
      cost: 7999.60,
      user: 'Purchasing Team',
      timestamp: new Date('2024-11-23T09:15:00'),
      status: 'completed',
      approvedBy: 'Purchasing Manager'
    }
  ];

  filteredMovements: StockMovement[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredMovements = [...this.movements];
  }

  getTodayMovements(): number {
    const today = new Date();
    return this.movements.filter(movement => 
      movement.timestamp.toDateString() === today.toDateString()
    ).length;
  }

  getTodayValue(): number {
    const today = new Date();
    return this.movements
      .filter(movement => 
        movement.timestamp.toDateString() === today.toDateString() && movement.cost
      )
      .reduce((total, movement) => total + (movement.cost || 0), 0);
  }

  getInboundCount(): number {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.movements.filter(movement => 
      movement.type === 'inbound' && movement.timestamp >= weekAgo
    ).length;
  }

  getOutboundCount(): number {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.movements.filter(movement => 
      movement.type === 'outbound' && movement.timestamp >= weekAgo
    ).length;
  }

  getAdjustmentCount(): number {
    return this.movements.filter(movement => 
      movement.type === 'adjustment' && movement.status === 'pending'
    ).length;
  }

  getMovementsByType(type: string): StockMovement[] {
    return this.movements.filter(movement => movement.type === type);
  }

  applyFilter() {
    this.filteredMovements = this.movements.filter(movement => {
      const matchesSearch = !this.searchTerm || 
        movement.itemName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.itemSku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.user.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedMovementTypes.length === 0 || 
        this.selectedMovementTypes.includes(movement.type);
      const matchesLocation = !this.locationFilter || movement.location === this.locationFilter;
      const matchesUser = !this.userFilter || movement.user === this.userFilter;
      const matchesStatus = !this.statusFilter || movement.status === this.statusFilter;
      const matchesDate = this.matchesDateFilter(movement);
      
      return matchesSearch && matchesType && matchesLocation && matchesUser && matchesStatus && matchesDate;
    });
  }

  matchesDateFilter(movement: StockMovement): boolean {
    if (!this.dateFilter) return true;
    
    const today = new Date();
    const movementDate = movement.timestamp;
    
    switch (this.dateFilter) {
      case 'today':
        return movementDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return movementDate >= weekAgo;
      case 'month':
        return movementDate.getMonth() === today.getMonth() && 
               movementDate.getFullYear() === today.getFullYear();
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        const movementQuarter = Math.floor(movementDate.getMonth() / 3);
        return movementQuarter === quarter && 
               movementDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.dateFilter = '';
    this.locationFilter = '';
    this.userFilter = '';
    this.statusFilter = '';
    this.selectedMovementTypes = [];
    this.applyFilter();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }

  getFilteredMovements(): StockMovement[] {
    return this.filteredMovements;
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.movements.map(movement => movement.location))].sort();
  }

  getUniqueUsers(): string[] {
    return [...new Set(this.movements.map(movement => movement.user))].sort();
  }

  getMovementTypeLabel(type: string): string {
    const movementType = this.movementTypes.find(mt => mt.value === type);
    return movementType ? movementType.label : type;
  }

  getMovementIcon(type: string): string {
    const movementType = this.movementTypes.find(mt => mt.value === type);
    return movementType ? movementType.icon : 'help';
  }

  getMovementMarkerClass(type: string): string {
    return `timeline-marker-${type}`;
  }

  getMovementCardClass(type: string): string {
    return `movement-card-${type}`;
  }

  getQuantityClass(type: string, quantity: number): string {
    if (type === 'inbound' || type === 'return' || (type === 'adjustment' && quantity > 0)) {
      return 'quantity-positive';
    } else if (type === 'outbound' || type === 'damage' || type === 'theft' || 
               (type === 'adjustment' && quantity < 0)) {
      return 'quantity-negative';
    }
    return 'quantity-neutral';
  }

  getQuantityDisplay(type: string, quantity: number): string {
    if (type === 'inbound' || type === 'return' || (type === 'adjustment' && quantity > 0)) {
      return `+${quantity}`;
    } else if (type === 'outbound' || type === 'damage' || type === 'theft' || 
               (type === 'adjustment' && quantity < 0)) {
      return `${quantity}`; // Already negative
    }
    return quantity.toString();
  }

  getStatusIcon(status: string): string {
    const statusIcons = {
      'completed': 'check_circle',
      'pending': 'schedule',
      'cancelled': 'cancel'
    };
    return statusIcons[status as keyof typeof statusIcons] || 'help';
  }

  openRecordMovementDialog() {
    const dialogRef = this.dialog.open(RecordMovementDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movements.unshift(result);
        this.applyFilter();
        this.snackBar.open('Stock movement recorded successfully', 'Close', { duration: 3000 });
      }
    });
  }

  generateReport() {
    this.snackBar.open('Generate Report functionality will be implemented', 'Close', { duration: 3000 });
  }

  exportMovements() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  importMovements() {
    this.snackBar.open('Import functionality will be implemented', 'Close', { duration: 3000 });
  }

  reconcileStock() {
    this.snackBar.open('Stock Reconciliation will be implemented', 'Close', { duration: 3000 });
  }

  viewMovementDetails(movement: StockMovement) {
    this.snackBar.open(`View details for: ${movement.reference}`, 'Close', { duration: 3000 });
  }

  approveMovement(movement: StockMovement) {
    if (movement.status === 'pending') {
      movement.status = 'completed';
      movement.approvedBy = 'Current User'; // In real app, get from auth service
      this.snackBar.open(`Movement ${movement.reference} approved`, 'Close', { duration: 3000 });
    }
  }

  rejectMovement(movement: StockMovement) {
    if (movement.status === 'pending') {
      movement.status = 'cancelled';
      this.snackBar.open(`Movement ${movement.reference} rejected`, 'Close', { duration: 3000 });
    }
  }

  editMovement(movement: StockMovement) {
    const dialogRef = this.dialog.open(RecordMovementDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: { 
        movement: movement,
        isEdit: true 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.movements.findIndex(m => m.id === movement.id);
        if (index > -1) {
          this.movements[index] = { ...result, id: movement.id };
          this.applyFilter();
          this.snackBar.open('Stock movement updated successfully', 'Close', { duration: 3000 });
        }
      }
    });
  }

  duplicateMovement(movement: StockMovement) {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now(),
      reference: `${movement.reference}-COPY`,
      timestamp: new Date(),
      status: 'pending',
      approvedBy: undefined
    };
    
    this.movements.unshift(newMovement);
    this.applyFilter();
    this.snackBar.open(`Movement ${movement.reference} duplicated`, 'Close', { duration: 3000 });
  }

  deleteMovement(movement: StockMovement) {
    if (confirm(`Are you sure you want to delete movement ${movement.reference}?`)) {
      const index = this.movements.findIndex(m => m.id === movement.id);
      if (index > -1) {
        this.movements.splice(index, 1);
        this.applyFilter();
        this.snackBar.open(`Movement ${movement.reference} deleted`, 'Close', { duration: 3000 });
      }
    }
  }
}
