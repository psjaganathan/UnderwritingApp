import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<{reply: string}> {
    return this.http.post<{reply: string}>(this.apiUrl, { message });
  }
}