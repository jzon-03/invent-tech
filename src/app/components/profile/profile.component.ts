import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Interface definitions
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  employeeId: string;
  role: string;
  department: string;
  manager?: string;
  location: string;
  officeLocation: string;
  workSchedule: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  joinDate: Date;
  avatar?: string;
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: number;
}

export interface UserActivity {
  id: string;
  type: 'login' | 'inventory' | 'order' | 'report' | 'system';
  title: string;
  description: string;
  timestamp: Date;
}

export interface UserPermission {
  id: string;
  name: string;
  granted: boolean;
}

export interface UserStats {
  loginCount: number;
  itemsProcessed: number;
  ordersCreated: number;
  averageSessionTime: string;
}

export interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // User profile data
  userProfile: UserProfile = {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@inventech.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'EMP001',
    role: 'Inventory Manager',
    department: 'Operations',
    manager: 'Michael Chen',
    location: 'New York, NY',
    officeLocation: 'Building A, Floor 3',
    workSchedule: 'Monday - Friday, 9:00 AM - 5:00 PM',
    status: 'Active',
    joinDate: new Date('2022-03-15'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    twoFactorEnabled: true,
    lastPasswordChange: new Date('2024-10-15'),
    activeSessions: 2
  };

  // Recent activities
  recentActivities: UserActivity[] = [
    {
      id: '1',
      type: 'inventory',
      title: 'Updated Stock Levels',
      description: 'Modified inventory for Widget Pro (WDG-PRO-001)',
      timestamp: new Date('2024-11-26T10:30:00')
    },
    {
      id: '2',
      type: 'order',
      title: 'Created Purchase Order',
      description: 'PO #PO-2024-1156 for TechCorp Inc.',
      timestamp: new Date('2024-11-26T09:15:00')
    },
    {
      id: '3',
      type: 'report',
      title: 'Generated Inventory Report',
      description: 'Monthly inventory analysis report',
      timestamp: new Date('2024-11-25T16:45:00')
    },
    {
      id: '4',
      type: 'login',
      title: 'Logged In',
      description: 'Successful login from 192.168.1.100',
      timestamp: new Date('2024-11-25T08:30:00')
    },
    {
      id: '5',
      type: 'system',
      title: 'Profile Updated',
      description: 'Updated notification preferences',
      timestamp: new Date('2024-11-24T14:20:00')
    }
  ];

  // User permissions
  userPermissions: UserPermission[] = [
    { id: '1', name: 'View Inventory', granted: true },
    { id: '2', name: 'Edit Inventory', granted: true },
    { id: '3', name: 'Create Orders', granted: true },
    { id: '4', name: 'Approve Orders', granted: true },
    { id: '5', name: 'Generate Reports', granted: true },
    { id: '6', name: 'Manage Users', granted: false },
    { id: '7', name: 'System Settings', granted: false },
    { id: '8', name: 'View Analytics', granted: true }
  ];

  // User statistics
  userStats: UserStats = {
    loginCount: 247,
    itemsProcessed: 1842,
    ordersCreated: 156,
    averageSessionTime: '3h 24m'
  };

  // Notification preferences
  notificationPreferences: NotificationPreference[] = [
    {
      id: '1',
      name: 'Low Stock Alerts',
      description: 'Get notified when items are running low',
      enabled: true
    },
    {
      id: '2',
      name: 'Order Updates',
      description: 'Receive updates on purchase orders',
      enabled: true
    },
    {
      id: '3',
      name: 'System Notifications',
      description: 'Important system updates and maintenance',
      enabled: true
    },
    {
      id: '4',
      name: 'Weekly Reports',
      description: 'Automated weekly inventory reports',
      enabled: false
    },
    {
      id: '5',
      name: 'Email Notifications',
      description: 'Send notifications to email',
      enabled: true
    }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  // Status and icon helper methods
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'check_circle';
      case 'inactive': return 'cancel';
      case 'on leave': return 'schedule';
      default: return 'help';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'login': return 'login';
      case 'inventory': return 'inventory';
      case 'order': return 'shopping_cart';
      case 'report': return 'assessment';
      case 'system': return 'settings';
      default: return 'timeline';
    }
  }

  // Action methods
  changeAvatar(): void {
    this.snackBar.open('Avatar change dialog would open here...', 'Close', {
      duration: 3000
    });
  }

  editProfile(): void {
    this.snackBar.open('Profile edit dialog would open here...', 'Close', {
      duration: 3000
    });
  }

  changePassword(): void {
    this.snackBar.open('Change password dialog would open here...', 'Close', {
      duration: 3000
    });
  }

  exportProfile(): void {
    this.snackBar.open('Exporting profile data...', 'Close', {
      duration: 3000
    });
  }

  downloadActivityReport(): void {
    this.snackBar.open('Downloading activity report...', 'Close', {
      duration: 3000
    });
  }

  deactivateAccount(): void {
    this.snackBar.open('Account deactivation dialog would open here...', 'Close', {
      duration: 3000
    });
  }

  refreshActivity(): void {
    this.snackBar.open('Refreshing activity data...', 'Close', {
      duration: 2000
    });
  }

  viewFullActivity(): void {
    this.snackBar.open('Opening full activity log...', 'Close', {
      duration: 3000
    });
  }

  toggleNotification(preference: NotificationPreference): void {
    preference.enabled = !preference.enabled;
    this.snackBar.open(
      `${preference.name} ${preference.enabled ? 'enabled' : 'disabled'}`,
      'Close',
      { duration: 2000 }
    );
  }

  manageNotifications(): void {
    this.snackBar.open('Opening notification management...', 'Close', {
      duration: 3000
    });
  }

  manageTwoFactor(): void {
    const action = this.userProfile.twoFactorEnabled ? 'manage' : 'enable';
    this.snackBar.open(`Opening two-factor authentication ${action}...`, 'Close', {
      duration: 3000
    });
  }

  manageSessions(): void {
    this.snackBar.open('Opening session management...', 'Close', {
      duration: 3000
    });
  }
}
