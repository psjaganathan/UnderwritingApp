import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreditMemoUploadService } from '../../services/credit-memo-upload.service';
import { UploadResponse } from '../../models/upload-response.model';
@Component({
  selector: 'app-upload-memo-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './upload-memo-dialog.component.html',
  styleUrls: ['./upload-memo-dialog.component.scss'],
  providers: [CreditMemoUploadService]
})
export class UploadMemoDialogComponent {
  selectedFile: File | null = null;
  filePath: string = '';
  errorMsg = '';
  maxFileSize = 5 * 1024 * 1024;
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  uploadStatus: 'idle' | 'success' | 'error' = 'idle';
  uploadMessage: string = '';

  constructor(private dialogRef: MatDialogRef<UploadMemoDialogComponent>, private uploadService:CreditMemoUploadService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.errorMsg = '';
    if (!file) return;
    if (!this.allowedTypes.includes(file.type)) {
      this.errorMsg = 'Invalid document type. Only PDF or Word documents are allowed.';
      this.selectedFile = null;
      return;
    }
    if (file.size > this.maxFileSize) {
      this.errorMsg = 'File size exceeds the 5MB limit.';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
    this.filePath = file.name;
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }

  onUpload() {
    if (this.selectedFile) {
      this.uploadStatus = 'idle';
      this.uploadMessage = '';
      this.uploadService.uploadFile(this.selectedFile, 'credit-approval-memos')
        .then(res => {
          this.uploadStatus = 'success';
          this.uploadMessage = 'Upload successful!' ;
        })
        .catch(err => {
          this.uploadStatus = 'error';
          this.uploadMessage = 'Upload failed. Please try again.';
        });
    }
  }
}
