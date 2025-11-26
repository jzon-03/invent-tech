import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryItem } from '../inventory/inventory.component';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.css'
})
export class AddItemDialogComponent implements OnInit {
  itemForm: FormGroup;
  
  private sampleItems = {
    electronics: {
      name: 'Wireless Bluetooth Speaker',
      description: 'Portable wireless speaker with premium sound quality and 12-hour battery life',
      category: 'Electronics',
      price: 79.99,
      stock: 25,
      minStock: 5
    },
    clothing: {
      name: 'Premium Cotton Hoodie',
      description: 'Comfortable cotton blend hoodie with adjustable hood and front pocket',
      category: 'Clothing',
      price: 45.99,
      stock: 40,
      minStock: 10
    }
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: [{value: '', disabled: true}],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    // Generate initial SKU
    this.generateSKU();
    
    // Watch for name changes to regenerate SKU
    this.itemForm.get('name')?.valueChanges.subscribe(() => {
      this.generateSKU();
    });
  }

  generateSKU() {
    const name = this.itemForm.get('name')?.value || '';
    const category = this.itemForm.get('category')?.value || '';
    
    if (name.length >= 2) {
      const nameCode = name.substring(0, 2).toUpperCase();
      const categoryCode = category ? category.substring(0, 1).toUpperCase() : 'X';
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const sku = `${nameCode}${categoryCode}-${randomNum}`;
      this.itemForm.get('sku')?.setValue(sku);
    }
  }

  fillSampleData(type: string) {
    if (type === 'electronics') {
      this.itemForm.patchValue(this.sampleItems.electronics);
    } else if (type === 'clothing') {
      this.itemForm.patchValue(this.sampleItems.clothing);
    } else if (type === 'random') {
      this.generateRandomItem();
    }
    this.generateSKU();
  }

  generateRandomItem() {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'];
    const adjectives = ['Premium', 'Professional', 'Deluxe', 'Advanced', 'Classic', 'Modern', 'Vintage', 'Smart'];
    const nouns = ['Device', 'Tool', 'Accessory', 'Equipment', 'Set', 'Kit', 'Collection', 'Bundle'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    this.itemForm.patchValue({
      name: `${randomAdjective} ${randomNoun}`,
      description: `High-quality ${randomAdjective.toLowerCase()} ${randomNoun.toLowerCase()} for professional and personal use`,
      category: randomCategory,
      price: Math.round((Math.random() * 200 + 10) * 100) / 100,
      stock: Math.floor(Math.random() * 100) + 10,
      minStock: Math.floor(Math.random() * 15) + 5
    });
  }

  getPreviewStatusClass(): string {
    const stock = this.itemForm.get('stock')?.value || 0;
    const minStock = this.itemForm.get('minStock')?.value || 0;
    
    if (stock === 0) return 'status-chip-out';
    if (stock <= minStock) return 'status-chip-low';
    return 'status-chip-in';
  }

  getPreviewStatusText(): string {
    const stock = this.itemForm.get('stock')?.value || 0;
    const minStock = this.itemForm.get('minStock')?.value || 0;
    
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  }

  onSave() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.getRawValue();
      const newItem: Partial<InventoryItem> = {
        ...formValue,
        id: Date.now(), // Simple ID generation
        lastUpdated: new Date()
      };
      
      this.dialogRef.close(newItem);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
