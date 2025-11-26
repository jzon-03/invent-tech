import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})
export class RootComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  showPlaceholder = false; // Set to false since we now have routing

  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}
