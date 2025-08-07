import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CreditMemoUploadService {
  private apiUrl = 'https://v0t84fuhc1.execute-api.us-east-1.amazonaws.com/prod/upload-credit-memo';

  constructor(private http: HttpClient) {}

  uploadFile(file: File,bucketname: string) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];

        this.http.post(this.apiUrl, {
          file: base64Data,
          filename: file.name,
          bucketname:bucketname
        }).subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
      };

      reader.readAsDataURL(file);
    });
  }
}
