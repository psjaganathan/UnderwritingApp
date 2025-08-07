import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './document-viewer-dialog.component.html',
  styleUrls: ['./document-viewer-dialog.component.scss']
})
export class DocumentViewerDialogComponent {
  public fileType: string;

  constructor(
    public dialogRef: MatDialogRef<DocumentViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string, type?: string }
  ) {
    this.fileType = data.type || this.inferFileType(data.url);
  }

  close() {
    this.dialogRef.close();
  }

  private inferFileType(url: string): string {
    if (url.endsWith('.pdf')) {
      return 'application/pdf';
    }
    if (url.endsWith('.docx')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    // Add more types as needed
    return '';
  }
}
