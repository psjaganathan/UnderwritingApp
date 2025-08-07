import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditMemo, Document } from '../models/credit-memo.model';

@Injectable({
  providedIn: 'root'
})
export class CreditMemoService implements OnInit {
  private apiUrl = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/credit-memos';

  constructor(private http: HttpClient) {}

 

  private creditMemosSubject = new BehaviorSubject<CreditMemo[]>([
    {
      id: 'CM001',
      title: 'ABC Corp',
      approvedAmount: 2500000,
      borrower: 'ABC Corporation',
      underwriter: 'John Smith',
      approvalDate: new Date('2024-01-15'),
      status: 'Ready to Release',
      documentsGenerated: true,
      documentsCount: 8,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM001.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'CM002',
      title: 'XYZ Ltd',
      approvedAmount: 1800000,
      borrower: 'XYZ Limited',
      underwriter: 'Jane Doe',
      approvalDate: new Date('2024-01-14'),
      status: 'Docs Creation Pending',
      documentsGenerated: false,
      documentsCount: 0,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM002.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'CM003',
      title: 'DEF Inc',
      approvedAmount: 3200000,
      borrower: 'DEF Incorporated',
      underwriter: 'Mike Johnson',
      approvalDate: new Date('2024-01-13'),
      status: 'Ready to Release',
      documentsGenerated: true,
      documentsCount: 12,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM003.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'CM004',
      title: 'GHI Corp',
      approvedAmount: 1500000,
      borrower: 'GHI Corporation',
      underwriter: 'Sarah Wilson',
      approvalDate: new Date('2024-01-12'),
      status: 'Docs Released',
      documentsGenerated: true,
      documentsCount: 6,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM004.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'CM005',
      title: 'JKL Ltd',
      approvedAmount: 2800000,
      borrower: 'JKL Limited',
      underwriter: 'Tom Brown',
      approvalDate: new Date('2024-01-11'),
      status: 'Docs Creation Pending',
      documentsGenerated: false,
      documentsCount: 0,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM005.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'CM006',
      title: 'MNO Inc',
      approvedAmount: 1200000,
      borrower: 'MNO Incorporated',
      underwriter: 'Lisa Davis',
      approvalDate: new Date('2024-01-10'),
      status: 'Docs Generation Failed',
      documentsGenerated: false,
      documentsCount: 0,
      memoSignedUrl: 'https://s3.amazonaws.com/example-bucket/CM006.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    }
  ]);

  private documentsSubject = new BehaviorSubject<Document[]>([
    {
      id: 'DOC001',
      name: 'Loan Agreement',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-15'),
      creditMemoId: 'CM001',
      template: 'Standard Loan Agreement',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC001.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'DOC002',
      name: 'Security Agreement',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-15'),
      creditMemoId: 'CM001',
      template: 'Standard Security Agreement',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC002.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'DOC003',
      name: 'Promissory Note',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-15'),
      creditMemoId: 'CM001',
      template: 'Standard Promissory Note',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC003.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'DOC004',
      name: 'UCC Financing Statement',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-15'),
      creditMemoId: 'CM001',
      template: 'UCC-1 Form',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC004.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'DOC005',
      name: 'Loan Agreement',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-13'),
      creditMemoId: 'CM003',
      template: 'Standard Loan Agreement',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC005.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'DOC006',
      name: 'Security Agreement',
      type: 'Legal Document',
      generatedDate: new Date('2024-01-13'),
      creditMemoId: 'CM003',
      template: 'Standard Security Agreement',
      status: 'Generated',
      documentSignedUrl: 'https://s3.amazonaws.com/example-bucket/DOC006.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    }
  ]);

  public creditMemos$: Observable<CreditMemo[]> = this.creditMemosSubject.asObservable();
  public documents$: Observable<Document[]> = this.documentsSubject.asObservable();

  ngOnInit() {
    // Try to fetch from API, fallback to static data on error
    this.http.get<{ memos: CreditMemo[]; documents: Document[] }>(this.apiUrl).subscribe({
      next: (data) => {
        if (data && data.memos) {
          this.creditMemosSubject.next(data.memos);
        }
        if (data && data.documents) {
          this.documentsSubject.next(data.documents);
        }
      },
      error: () => {
        // Keep static data already in BehaviorSubjects
      }
    });
  }

  getCreditMemos(): Observable<CreditMemo[]> {
    return this.creditMemos$;
  }

  getDocumentsByCreditMemoId(creditMemoId: string): Observable<Document[]> {
    return new Observable(observer => {
      const sub = this.documents$.subscribe(documents => {
        const filteredDocs = documents.filter(doc => doc.creditMemoId === creditMemoId);
        observer.next(filteredDocs);
      });
      return () => sub.unsubscribe();
    });
  }

  uploadNewMemo(memoData: Partial<CreditMemo>): void {
    // Simulate uploading a new memo
    const newMemo: CreditMemo = {
      id: `CM${Date.now()}`,
      title: memoData.title || 'New Company',
      approvedAmount: memoData.approvedAmount || 1000000,
      borrower: memoData.borrower || 'New Borrower',
      underwriter: memoData.underwriter || 'Current User',
      approvalDate: new Date(),
      status: 'Docs Creation Pending',
      documentsGenerated: false,
      documentsCount: 0,
      memoSignedUrl: memoData.memoSignedUrl || ''
    };

    const currentMemos = this.creditMemosSubject.value;
    this.creditMemosSubject.next([newMemo, ...currentMemos]);

    // Automatically start document generation process
    setTimeout(() => {
      this.startDocumentGeneration(newMemo.id);
    }, 2000); // Simulate 2 second delay before starting generation
  }

  startDocumentGeneration(creditMemoId: string): void {
    // Update status to show generation is starting
    const currentMemos = this.creditMemosSubject.value;
    const updatedMemos = currentMemos.map(memo => {
      if (memo.id === creditMemoId) {
        return {
          ...memo,
          status: 'Docs Creation Pending' as const
        };
      }
      return memo;
    });
    this.creditMemosSubject.next(updatedMemos);

    // Simulate document generation process
    setTimeout(() => {
      this.generateDocuments(creditMemoId);
    }, 3000); // Simulate 3 second generation time
  }

  generateDocuments(creditMemoId: string): void {
    // Simulate document generation
    const newDocuments: Document[] = [
      {
        id: `DOC${Date.now()}`,
        name: 'Loan Agreement',
        type: 'Legal Document',
        generatedDate: new Date(),
        creditMemoId: creditMemoId,
        template: 'Standard Loan Agreement',
        status: 'Generated'
      },
      {
        id: `DOC${Date.now() + 1}`,
        name: 'Security Agreement',
        type: 'Legal Document',
        generatedDate: new Date(),
        creditMemoId: creditMemoId,
        template: 'Standard Security Agreement',
        status: 'Generated'
      }
    ];

    const currentDocs = this.documentsSubject.value;
    this.documentsSubject.next([...currentDocs, ...newDocuments]);

    // Update credit memo to reflect documents generated
    const currentMemos = this.creditMemosSubject.value;
    const updatedMemos = currentMemos.map(memo => {
      if (memo.id === creditMemoId) {
        return {
          ...memo,
          documentsGenerated: true,
          documentsCount: memo.documentsCount + newDocuments.length,
          status: 'Ready to Release' as const
        };
      }
      return memo;
    });
    this.creditMemosSubject.next(updatedMemos);
  }

  removeDocument(documentId: string): void {
    const currentDocs = this.documentsSubject.value;
    const filteredDocs = currentDocs.filter(doc => doc.id !== documentId);
    this.documentsSubject.next(filteredDocs);
  }

  releaseSelectedDocuments(selectedDocumentIds: string[]): void {
    console.log('Releasing documents:', selectedDocumentIds);
    // Update status to 'Docs Released' for the credit memo
    const currentMemos = this.creditMemosSubject.value;
    const updatedMemos = currentMemos.map(memo => {
      // Find if any of the selected documents belong to this memo
      const hasSelectedDocs = selectedDocumentIds.some(docId => {
        const doc = this.documentsSubject.value.find(d => d.id === docId);
        return doc && doc.creditMemoId === memo.id;
      });
      
      if (hasSelectedDocs) {
        return {
          ...memo,
          status: 'Docs Released' as const
        };
      }
      return memo;
    });
    this.creditMemosSubject.next(updatedMemos);
  }
}
