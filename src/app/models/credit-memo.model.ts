export interface CreditMemo {
  id: string;
  title: string;
  approvedAmount: number;
  borrower: string;
  underwriter: string;
  approvalDate: Date;
  status: 'Docs Creation Pending' | 'Ready to Release' | 'Docs Released' | 'Docs Generation Failed';
  documentsGenerated: boolean;
  documentsCount: number;
  memoSignedUrl: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  generatedDate: Date;
  creditMemoId: string;
  template: string;
  status: 'Generated' | 'Pending' | 'Failed';
  selected?: boolean;
  documentSignedUrl?: string;
} 