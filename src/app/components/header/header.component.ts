import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private layoutService: LayoutService) {}

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  logout(): void {
    // Implement logout functionality
    console.log('Logout clicked');
  }

  openAssistChat(): void {
    const event = new CustomEvent('openAssistChat');
    window.dispatchEvent(event);
  }
}
