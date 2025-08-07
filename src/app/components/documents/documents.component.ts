import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditMemoService } from '../../services/credit-memo.service';
import { Document, CreditMemo } from '../../models/credit-memo.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentViewerDialogComponent } from './document-viewer-dialog.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  creditMemo: CreditMemo | null = null;
  selectedDocuments: string[] = [];

  constructor(
    private creditMemoService: CreditMemoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const creditMemoId = this.route.snapshot.paramMap.get('id');
    if (creditMemoId) {
      this.loadDocuments(creditMemoId);
      this.loadCreditMemo(creditMemoId);
    }
  }

  loadDocuments(creditMemoId: string): void {
    this.creditMemoService.getDocumentsByCreditMemoId(creditMemoId).subscribe(documents => {
      this.documents = documents;
    });
  }

  loadCreditMemo(creditMemoId: string): void {
    this.creditMemoService.getCreditMemos().subscribe(memos => {
      this.creditMemo = memos.find(memo => memo.id === creditMemoId) || null;
    });
  }

  toggleDocumentSelection(documentId: string): void {
    const index = this.selectedDocuments.indexOf(documentId);
    if (index > -1) {
      this.selectedDocuments.splice(index, 1);
    } else {
      this.selectedDocuments.push(documentId);
    }
  }

  selectAllDocuments(): void {
    if (this.selectedDocuments.length === this.documents.length) {
      this.selectedDocuments = [];
    } else {
      this.selectedDocuments = this.documents.map(doc => doc.id);
    }
  }

  viewDocument(document: Document): void {
    if (!document.documentSignedUrl) {
      alert('No signed document available for this file.');
      return;
    }
    let type = '';
    if (document.documentSignedUrl.endsWith('.pdf')) {
      type = 'application/pdf';
    } else if (document.documentSignedUrl.endsWith('.docx')) {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    this.dialog.open(DocumentViewerDialogComponent, {
      width: '700px',
      data: {
        url: document.documentSignedUrl,
        type
      }
    });
  }

  removeDocument(documentId: string): void {
    this.creditMemoService.removeDocument(documentId);
    // Remove from selected if present
    const index = this.selectedDocuments.indexOf(documentId);
    if (index > -1) {
      this.selectedDocuments.splice(index, 1);
    }
  }

  releaseSelectedDocuments(): void {
    if (this.selectedDocuments.length > 0) {
      this.creditMemoService.releaseSelectedDocuments(this.selectedDocuments);
      this.selectedDocuments = [];
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'generated':
        return 'accent';
      case 'pending':
        return 'warn';
      case 'failed':
        return 'primary';
      default:
        return 'primary';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
