import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ReportData {
  id: number;
  name: string;
  type: 'inventory' | 'sales' | 'movement' | 'supplier';
  period: string;
  generatedDate: Date;
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
  description: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  selectedPeriod = 'month';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  
  // Metric changes (percentage)
  inventoryValueChange = 8.5;
  salesChange = 12.3;
  turnoverChange = -2.1;
  
  reportColumns = ['name', 'period', 'generated', 'size', 'status', 'actions'];
  
  recentReports: ReportData[] = [
    {
      id: 1,
      name: 'Inventory Valuation Report',
      type: 'inventory',
      period: 'November 2024',
      generatedDate: new Date('2024-11-25T14:30:00'),
      fileSize: '2.4 MB',
      status: 'ready',
      description: 'Complete inventory valuation analysis'
    },
    {
      id: 2,
      name: 'Sales Summary Report',
      type: 'sales',
      period: 'Q4 2024',
      generatedDate: new Date('2024-11-24T09:15:00'),
      fileSize: '1.8 MB',
      status: 'ready',
      description: 'Quarterly sales performance report'
    },
    {
      id: 3,
      name: 'Stock Movement Analysis',
      type: 'movement',
      period: 'Last 30 Days',
      generatedDate: new Date('2024-11-23T16:45:00'),
      fileSize: '3.2 MB',
      status: 'ready',
      description: 'Detailed stock movement tracking'
    },
    {
      id: 4,
      name: 'Supplier Performance Report',
      type: 'supplier',
      period: 'November 2024',
      generatedDate: new Date('2024-11-22T11:20:00'),
      fileSize: '1.5 MB',
      status: 'ready',
      description: 'Vendor performance metrics and analysis'
    },
    {
      id: 5,
      name: 'ABC Analysis Report',
      type: 'inventory',
      period: 'Current Period',
      generatedDate: new Date('2024-11-21T13:10:00'),
      fileSize: '987 KB',
      status: 'generating',
      description: 'Product classification analysis'
    },
    {
      id: 6,
      name: 'Low Stock Alert Report',
      type: 'inventory',
      period: 'Real-time',
      generatedDate: new Date('2024-11-20T08:30:00'),
      fileSize: '542 KB',
      status: 'ready',
      description: 'Items below minimum threshold'
    }
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.setDefaultDates();
  }

  private setDefaultDates() {
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  onPeriodChange() {
    const today = new Date();
    
    switch (this.selectedPeriod) {
      case 'today':
        this.fromDate = today;
        this.toDate = today;
        break;
      case 'week':
        this.fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.toDate = today;
        break;
      case 'month':
        this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.toDate = today;
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        this.fromDate = new Date(today.getFullYear(), quarter * 3, 1);
        this.toDate = today;
        break;
      case 'year':
        this.fromDate = new Date(today.getFullYear(), 0, 1);
        this.toDate = today;
        break;
      case 'custom':
        // Keep existing dates for custom selection
        break;
    }
  }

  onDateChange() {
    // Handle custom date range changes
    if (this.fromDate && this.toDate) {
      this.snackBar.open(`Date range updated: ${this.fromDate.toDateString()} to ${this.toDate.toDateString()}`, 'Close', { 
        duration: 2000 
      });
    }
  }

  // KPI Methods
  getTotalInventoryValue(): number {
    // Mock calculation - in real app, calculate from actual inventory data
    return 487350.75;
  }

  getSalesRevenue(): number {
    // Mock calculation based on period
    const baseRevenue = 125680.50;
    const multiplier = this.getPeriodMultiplier();
    return baseRevenue * multiplier;
  }

  getInventoryTurnover(): number {
    // Mock turnover rate
    return 4.2;
  }

  getLowStockCount(): number {
    // Mock count of low stock items
    return 23;
  }

  getLowStockPercentage(): number {
    // Mock percentage calculation
    return 15.3;
  }

  private getPeriodMultiplier(): number {
    switch (this.selectedPeriod) {
      case 'today': return 0.033; // ~1/30 of month
      case 'week': return 0.25;
      case 'month': return 1;
      case 'quarter': return 3;
      case 'year': return 12;
      default: return 1;
    }
  }

  getChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  getChangeIcon(change: number): string {
    if (change > 0) return 'trending_up';
    if (change < 0) return 'trending_down';
    return 'trending_flat';
  }

  // Report Generation Methods
  generateReport(reportType: string) {
    this.snackBar.open(`Generating ${reportType.replace('-', ' ')} report...`, 'Close', { duration: 3000 });
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: ReportData = {
        id: Date.now(),
        name: this.getReportName(reportType),
        type: this.getReportCategory(reportType),
        period: this.getSelectedPeriodLabel(),
        generatedDate: new Date(),
        fileSize: this.getRandomFileSize(),
        status: 'ready',
        description: `Generated ${reportType.replace('-', ' ')} report`
      };
      
      this.recentReports.unshift(newReport);
      if (this.recentReports.length > 10) {
        this.recentReports.pop();
      }
      
      this.snackBar.open('Report generated successfully!', 'Close', { duration: 3000 });
    }, 2000);
  }

  private getReportName(type: string): string {
    const names: { [key: string]: string } = {
      'inventory-valuation': 'Inventory Valuation Report',
      'stock-levels': 'Stock Levels Report',
      'low-stock': 'Low Stock Alert Report',
      'abc-analysis': 'ABC Analysis Report',
      'sales-summary': 'Sales Summary Report',
      'top-products': 'Top Selling Products Report',
      'sales-by-category': 'Sales by Category Report',
      'profit-analysis': 'Profit Analysis Report',
      'movement-summary': 'Movement Summary Report',
      'transfer-report': 'Transfer Report',
      'adjustments': 'Stock Adjustments Report',
      'shrinkage': 'Shrinkage Analysis Report',
      'supplier-performance': 'Supplier Performance Report',
      'purchase-analysis': 'Purchase Analysis Report',
      'cost-comparison': 'Cost Comparison Report',
      'order-history': 'Order History Report'
    };
    return names[type] || 'Custom Report';
  }

  private getReportCategory(type: string): 'inventory' | 'sales' | 'movement' | 'supplier' {
    if (type.includes('sales') || type.includes('profit') || type.includes('products')) return 'sales';
    if (type.includes('movement') || type.includes('transfer') || type.includes('adjustment') || type.includes('shrinkage')) return 'movement';
    if (type.includes('supplier') || type.includes('purchase') || type.includes('cost') || type.includes('order')) return 'supplier';
    return 'inventory';
  }

  private getSelectedPeriodLabel(): string {
    const labels: { [key: string]: string } = {
      'today': 'Today',
      'week': 'This Week',
      'month': 'This Month',
      'quarter': 'This Quarter',
      'year': 'This Year',
      'custom': 'Custom Range'
    };
    return labels[this.selectedPeriod] || 'Unknown Period';
  }

  private getRandomFileSize(): string {
    const sizes = ['542 KB', '1.2 MB', '2.1 MB', '987 KB', '3.4 MB', '1.8 MB', '675 KB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  generateCustomReport() {
    this.snackBar.open('Custom Report Builder will be implemented', 'Close', { duration: 3000 });
  }

  scheduleReport() {
    this.snackBar.open('Report Scheduling will be implemented', 'Close', { duration: 3000 });
  }

  exportReport(format: string) {
    this.snackBar.open(`Exporting all reports as ${format.toUpperCase()}...`, 'Close', { duration: 3000 });
  }

  // Report Table Methods
  getReportIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'inventory': 'inventory_2',
      'sales': 'point_of_sale',
      'movement': 'swap_horiz',
      'supplier': 'business'
    };
    return icons[type] || 'assessment';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'ready': 'check_circle',
      'generating': 'autorenew',
      'failed': 'error'
    };
    return icons[status] || 'help';
  }

  downloadReport(report: ReportData) {
    this.snackBar.open(`Downloading ${report.name}...`, 'Close', { duration: 2000 });
  }

  viewReport(report: ReportData) {
    this.snackBar.open(`Opening ${report.name}...`, 'Close', { duration: 2000 });
  }

  shareReport(report: ReportData) {
    this.snackBar.open(`Sharing ${report.name}...`, 'Close', { duration: 2000 });
  }

  deleteReport(report: ReportData) {
    if (confirm(`Are you sure you want to delete "${report.name}"?`)) {
      const index = this.recentReports.findIndex(r => r.id === report.id);
      if (index > -1) {
        this.recentReports.splice(index, 1);
        this.snackBar.open('Report deleted successfully', 'Close', { duration: 2000 });
      }
    }
  }

  viewAllReports() {
    this.snackBar.open('View All Reports page will be implemented', 'Close', { duration: 3000 });
  }

  // Chart Methods
  openDetailChart(chartType: string) {
    this.snackBar.open(`Opening detailed ${chartType} chart...`, 'Close', { duration: 2000 });
  }
}
