import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadMemoDialogComponent } from '../upload-memo/upload-memo-dialog.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'upload', label: 'Upload Memo', route: '/upload', isUpload: true },
    { icon: 'policy', label: 'Doc Generation Policy', route: '/policiy' },
    { icon: 'article', label: 'Doc Templates', route: '/template' }
  ];

  constructor(private layoutService: LayoutService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.layoutService.sidebarCollapsed$.subscribe(
      collapsed => this.sidebarCollapsed = collapsed
    );
    // Collapse sidebar on small screens
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize(): void {
    if (window.innerWidth <= 900) {
      this.layoutService.setSidebarCollapsed(true);
    } else {
      this.layoutService.setSidebarCollapsed(false);
    }
  }

  onMenuClick(item: any) {
    if (item.isUpload) {
      const dialogRef = this.dialog.open(UploadMemoDialogComponent, {
        width: '370px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.router.navigate([item.route]);
    }
  }
}
