export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Legal Document' | 'Financial Document' | 'Compliance Document' | 'Other';
  version: string;
  lastModified: Date;
  isActive: boolean;
  documentType: string;
  signedUrl: string;
  requiredFields: string[];
  optionalFields: string[];
} 