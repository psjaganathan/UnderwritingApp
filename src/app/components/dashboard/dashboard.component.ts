import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditMemoService } from '../../services/credit-memo.service';
import { CreditMemo } from '../../models/credit-memo.model';
import { MatDialog } from '@angular/material/dialog';
import { UploadMemoDialogComponent } from '../upload-memo/upload-memo-dialog.component';
import { DocumentViewerDialogComponent } from '../documents/document-viewer-dialog.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  creditMemos: CreditMemo[] = [];
  filteredMemos: CreditMemo[] = [];
  selectedFilter: string = 'all';

  constructor(
    private creditMemoService: CreditMemoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.creditMemoService.getCreditMemos().subscribe(memos => {
      this.creditMemos = memos;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    switch (this.selectedFilter) {
      case 'pending':
        this.filteredMemos = this.creditMemos.filter(memo => memo.status === 'Docs Creation Pending');
        break;
      case 'ready':
        this.filteredMemos = this.creditMemos.filter(memo => memo.status === 'Ready to Release');
        break;
      case 'released':
        this.filteredMemos = this.creditMemos.filter(memo => memo.status === 'Docs Released');
        break;
      case 'failed':
        this.filteredMemos = this.creditMemos.filter(memo => memo.status === 'Docs Generation Failed');
        break;
      default:
        this.filteredMemos = this.creditMemos;
        break;
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  uploadNewMemo(): void {
    const dialogRef = this.dialog.open(UploadMemoDialogComponent, {
      width: '370px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/dashboard']);
    });
  }

  viewMemo(memo: CreditMemo): void {
    if (!memo.memoSignedUrl) {
      alert('No memo document available for this credit memo.');
      return;
    }
    // Infer file type from URL
    let type = '';
    if (memo.memoSignedUrl.endsWith('.pdf')) {
      type = 'application/pdf';
    } else if (memo.memoSignedUrl.endsWith('.docx')) {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    this.dialog.open(DocumentViewerDialogComponent, {
      width: '700px',
      data: {
        url: memo.memoSignedUrl,
        type
      }
    });
  }

  viewDocuments(memo: CreditMemo): void {
    this.router.navigate(['/documents', memo.id]);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'ready to release':
        return 'accent';
      case 'docs released':
        return 'primary';
      case 'docs creation pending':
        return 'warn';
      case 'docs generation failed':
        return 'warn';
      default:
        return 'primary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  getFilterCount(filter: string): number {
    switch (filter) {
      case 'pending':
        return this.creditMemos.filter(memo => memo.status === 'Docs Creation Pending').length;
      case 'ready':
        return this.creditMemos.filter(memo => memo.status === 'Ready to Release').length;
      case 'released':
        return this.creditMemos.filter(memo => memo.status === 'Docs Released').length;
      case 'failed':
        return this.creditMemos.filter(memo => memo.status === 'Docs Generation Failed').length;
      default:
        return this.creditMemos.length;
    }
  }

  // Returns a numeric order for each status for CSS ordering
  getStatusOrder(status: string): number {
    switch (status) {
      case 'Docs Creation Pending':
        return 1;
      case 'Ready to Release':
        return 2;
      case 'Docs Released':
        return 3;
      case 'Docs Generation Failed':
        return 4;
      default:
        return 5;
    }
  }
}
