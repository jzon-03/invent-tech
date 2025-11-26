import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { StockMovement, MovementType } from '../stock-movement/stock-movement.component';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  unit: string;
  location: string;
  unitCost: number;
  category: string;
}

export interface DialogData {
  movement?: StockMovement;
  isEdit?: boolean;
}

@Component({
  selector: 'app-record-movement-dialog',
  templateUrl: './record-movement-dialog.component.html',
  styleUrl: './record-movement-dialog.component.css'
})
export class RecordMovementDialogComponent implements OnInit {
  movementForm: FormGroup;
  selectedItem: InventoryItem | null = null;
  filteredItems: Observable<InventoryItem[]>;
  
  movementTypes: MovementType[] = [
    { value: 'inbound', label: 'Stock In', icon: 'arrow_downward' },
    { value: 'outbound', label: 'Stock Out', icon: 'arrow_upward' },
    { value: 'transfer', label: 'Transfer', icon: 'swap_horiz' },
    { value: 'adjustment', label: 'Adjustment', icon: 'tune' },
    { value: 'return', label: 'Return', icon: 'undo' },
    { value: 'damage', label: 'Damage', icon: 'warning' }
  ];
  
  locations: string[] = [
    'Main Warehouse',
    'Store Location A',
    'Store Location B', 
    'Store Location C',
    'Returns Area',
    'Quality Control',
    'Shipping Dock',
    'Receiving Area'
  ];
  
  // Sample inventory items for autocomplete
  inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-1000XM4',
      currentStock: 45,
      unit: 'pcs',
      location: 'Main Warehouse',
      unitCost: 299.99,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Bluetooth Speakers',
      sku: 'BT-SP-200',
      currentStock: 32,
      unit: 'pcs',
      location: 'Main Warehouse', 
      unitCost: 149.99,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Smartphone Cases',
      sku: 'SC-IPHONE15',
      currentStock: 128,
      unit: 'pcs',
      location: 'Store Location A',
      unitCost: 24.99,
      category: 'Accessories'
    },
    {
      id: 4,
      name: 'USB Cables',
      sku: 'USB-C-3M',
      currentStock: 85,
      unit: 'pcs',
      location: 'Main Warehouse',
      unitCost: 12.99,
      category: 'Accessories'
    },
    {
      id: 5,
      name: 'Laptop Chargers',
      sku: 'LC-DELL-90W',
      currentStock: 23,
      unit: 'pcs',
      location: 'Main Warehouse',
      unitCost: 49.99,
      category: 'Electronics'
    },
    {
      id: 6,
      name: 'Wireless Mouse',
      sku: 'WM-LOGI-MX3',
      currentStock: 67,
      unit: 'pcs',
      location: 'Store Location B',
      unitCost: 89.99,
      category: 'Accessories'
    },
    {
      id: 7,
      name: 'Gaming Keyboards',
      sku: 'GK-MECH-RGB',
      currentStock: 54,
      unit: 'pcs',
      location: 'Main Warehouse',
      unitCost: 129.99,
      category: 'Electronics'
    },
    {
      id: 8,
      name: 'Tablet Stands',
      sku: 'TS-ADJUST-PRO',
      currentStock: 41,
      unit: 'pcs',
      location: 'Store Location C',
      unitCost: 79.99,
      category: 'Accessories'
    },
    {
      id: 9,
      name: 'Power Banks',
      sku: 'PB-20000MAH',
      currentStock: 76,
      unit: 'pcs',
      location: 'Main Warehouse',
      unitCost: 59.99,
      category: 'Electronics'
    },
    {
      id: 10,
      name: 'Screen Protectors',
      sku: 'SP-TEMPERED-9H',
      currentStock: 203,
      unit: 'pcs',
      location: 'Store Location A',
      unitCost: 9.99,
      category: 'Accessories'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordMovementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.movementForm = this.createForm();
    this.filteredItems = this.movementForm.get('itemSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItems(value))
    );
  }

  ngOnInit() {
    if (this.data?.movement && this.data?.isEdit) {
      this.loadMovementForEdit(this.data.movement);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      itemSearch: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
      location: [''],
      fromLocation: [''],
      toLocation: [''],
      reference: ['', Validators.required],
      cost: [''],
      reason: ['']
    });
  }

  private loadMovementForEdit(movement: StockMovement) {
    // Find the item for this movement
    this.selectedItem = this.inventoryItems.find(item => item.name === movement.itemName) || null;
    
    this.movementForm.patchValue({
      type: movement.type,
      quantity: Math.abs(movement.quantity),
      location: movement.location,
      fromLocation: movement.fromLocation,
      toLocation: movement.toLocation,
      reference: movement.reference,
      cost: movement.cost,
      reason: movement.reason
    });

    this.updateValidators();
  }

  private filterItems(value: string | InventoryItem): InventoryItem[] {
    if (!value || typeof value !== 'string') {
      return this.inventoryItems;
    }
    
    const filterValue = value.toLowerCase();
    return this.inventoryItems.filter(item => 
      item.name.toLowerCase().includes(filterValue) ||
      item.sku.toLowerCase().includes(filterValue)
    );
  }

  displayItem(item: InventoryItem): string {
    return item ? `${item.name} (${item.sku})` : '';
  }

  selectItem(item: InventoryItem) {
    this.selectedItem = item;
    this.movementForm.patchValue({
      location: item.location
    });
    this.updateValidators();
  }

  private updateValidators() {
    const typeControl = this.movementForm.get('type');
    const locationControl = this.movementForm.get('location');
    const fromLocationControl = this.movementForm.get('fromLocation');
    const toLocationControl = this.movementForm.get('toLocation');

    // Clear existing validators
    locationControl?.clearValidators();
    fromLocationControl?.clearValidators();
    toLocationControl?.clearValidators();

    if (this.isTransferType()) {
      fromLocationControl?.setValidators([Validators.required]);
      toLocationControl?.setValidators([Validators.required]);
    } else {
      locationControl?.setValidators([Validators.required]);
    }

    locationControl?.updateValueAndValidity();
    fromLocationControl?.updateValueAndValidity();
    toLocationControl?.updateValueAndValidity();
  }

  isTransferType(): boolean {
    return this.movementForm.get('type')?.value === 'transfer';
  }

  showCostField(): boolean {
    const type = this.movementForm.get('type')?.value;
    return ['inbound', 'outbound', 'damage', 'return'].includes(type);
  }

  getQuantityPlaceholder(): string {
    const type = this.movementForm.get('type')?.value;
    switch (type) {
      case 'inbound': return 'Quantity received';
      case 'outbound': return 'Quantity shipped';
      case 'transfer': return 'Quantity to transfer';
      case 'adjustment': return 'Adjustment amount';
      case 'return': return 'Quantity returned';
      case 'damage': return 'Quantity damaged';
      default: return 'Enter quantity';
    }
  }

  getReferencePlaceholder(): string {
    const type = this.movementForm.get('type')?.value;
    switch (type) {
      case 'inbound': return 'PO-2024-XXX';
      case 'outbound': return 'SO-2024-XXX';
      case 'transfer': return 'TR-2024-XXX';
      case 'adjustment': return 'ADJ-2024-XXX';
      case 'return': return 'RET-2024-XXX';
      case 'damage': return 'DMG-2024-XXX';
      default: return 'Enter reference';
    }
  }

  getImpactLabel(): string {
    const type = this.movementForm.get('type')?.value;
    switch (type) {
      case 'inbound':
      case 'return': return 'Stock Increase';
      case 'outbound':
      case 'damage': return 'Stock Decrease';
      case 'transfer': return 'Transfer Amount';
      case 'adjustment': return 'Adjustment';
      default: return 'Change';
    }
  }

  getImpactValue(): string {
    const quantity = this.movementForm.get('quantity')?.value || 0;
    const type = this.movementForm.get('type')?.value;
    
    switch (type) {
      case 'inbound':
      case 'return': return `+${quantity}`;
      case 'outbound':
      case 'damage': return `-${quantity}`;
      case 'transfer': return `${quantity}`;
      case 'adjustment': return `±${quantity}`;
      default: return quantity.toString();
    }
  }

  getImpactClass(): string {
    const type = this.movementForm.get('type')?.value;
    switch (type) {
      case 'inbound':
      case 'return': return 'positive';
      case 'outbound':
      case 'damage': return 'negative';
      default: return 'neutral';
    }
  }

  getNewStockLevel(): number {
    if (!this.selectedItem) return 0;
    
    const quantity = this.movementForm.get('quantity')?.value || 0;
    const type = this.movementForm.get('type')?.value;
    
    switch (type) {
      case 'inbound':
      case 'return': return this.selectedItem.currentStock + quantity;
      case 'outbound':
      case 'damage': return this.selectedItem.currentStock - quantity;
      case 'transfer': return this.selectedItem.currentStock; // Depends on location
      case 'adjustment': return this.selectedItem.currentStock + quantity; // Simplified
      default: return this.selectedItem.currentStock;
    }
  }

  getNewStockClass(): string {
    const newLevel = this.getNewStockLevel();
    if (newLevel < 0) return 'negative';
    if (newLevel < 10) return 'low';
    return 'normal';
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.movementForm.valid && this.selectedItem) {
      const formValue = this.movementForm.value;
      const quantity = formValue.quantity;
      const type = formValue.type;
      
      // Calculate actual quantity based on movement type
      let actualQuantity = quantity;
      if (['outbound', 'damage'].includes(type)) {
        actualQuantity = -quantity;
      }
      
      const newMovement: StockMovement = {
        id: Date.now(),
        itemName: this.selectedItem.name,
        itemSku: this.selectedItem.sku,
        type: type,
        quantity: actualQuantity,
        location: this.isTransferType() ? formValue.toLocation : formValue.location,
        fromLocation: formValue.fromLocation,
        toLocation: formValue.toLocation,
        reference: formValue.reference,
        reason: formValue.reason,
        cost: formValue.cost ? parseFloat(formValue.cost) : undefined,
        user: 'Current User', // In real app, get from auth service
        timestamp: new Date(),
        status: ['adjustment', 'damage'].includes(type) ? 'pending' : 'completed'
      };
      
      this.dialogRef.close(newMovement);
    }
  }
}
