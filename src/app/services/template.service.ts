import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Template } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templatesSubject = new BehaviorSubject<Template[]>([
    {
      id: 'TPL001',
      name: 'Standard Loan Agreement',
      description: 'Standard loan agreement template for commercial lending',
      category: 'Legal Document',
      version: '2.1',
      lastModified: new Date('2024-01-15'),
      isActive: true,
      documentType: 'Loan Agreement',
      requiredFields: ['borrower', 'amount', 'interest_rate', 'term', 'collateral'],
      optionalFields: ['prepayment_penalty', 'late_fee', 'default_terms'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL001.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL002',
      name: 'Security Agreement',
      description: 'Security agreement template for collateral documentation',
      category: 'Legal Document',
      version: '1.8',
      lastModified: new Date('2024-01-14'),
      isActive: true,
      documentType: 'Security Agreement',
      requiredFields: ['borrower', 'collateral_description', 'security_interest'],
      optionalFields: ['insurance_requirements', 'maintenance_obligations'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL002.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL003',
      name: 'Promissory Note',
      description: 'Promissory note template for debt documentation',
      category: 'Legal Document',
      version: '1.5',
      lastModified: new Date('2024-01-13'),
      isActive: true,
      documentType: 'Promissory Note',
      requiredFields: ['borrower', 'amount', 'interest_rate', 'maturity_date'],
      optionalFields: ['payment_schedule', 'default_events'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL003.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL004',
      name: 'UCC Financing Statement',
      description: 'UCC-1 financing statement template',
      category: 'Legal Document',
      version: '1.2',
      lastModified: new Date('2024-01-12'),
      isActive: true,
      documentType: 'UCC Financing Statement',
      requiredFields: ['debtor_name', 'secured_party', 'collateral_description'],
      optionalFields: ['filing_office', 'filing_fee'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL004.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL005',
      name: 'Financial Statement',
      description: 'Financial statement template for borrower reporting',
      category: 'Financial Document',
      version: '1.0',
      lastModified: new Date('2024-01-11'),
      isActive: true,
      documentType: 'Financial Statement',
      requiredFields: ['borrower', 'reporting_period', 'assets', 'liabilities'],
      optionalFields: ['cash_flow', 'ratios', 'projections'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL005.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL006',
      name: 'Compliance Certificate',
      description: 'Compliance certificate template for regulatory reporting',
      category: 'Compliance Document',
      version: '1.3',
      lastModified: new Date('2024-01-10'),
      isActive: true,
      documentType: 'Compliance Certificate',
      requiredFields: ['borrower', 'compliance_period', 'covenants'],
      optionalFields: ['waivers', 'exceptions'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL006.docx?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    },
    {
      id: 'TPL007',
      name: 'Loan Modification Agreement',
      description: 'Template for loan modification agreements',
      category: 'Legal Document',
      version: '1.1',
      lastModified: new Date('2024-01-09'),
      isActive: false,
      documentType: 'Loan Modification',
      requiredFields: ['original_loan_id', 'modification_terms', 'effective_date'],
      optionalFields: ['fee_waivers', 'extension_terms'],
      signedUrl: 'https://s3.amazonaws.com/example-bucket/TPL007.pdf?AWSAccessKeyId=EXAMPLE&Expires=9999999999&Signature=EXAMPLE'
    }
  ]);

  public templates$: Observable<Template[]> = this.templatesSubject.asObservable();

  constructor() { }

  getTemplates(): Observable<Template[]> {
    return this.templates$;
  }

  getTemplateById(id: string): Observable<Template | undefined> {
    return new Observable(observer => {
      this.templates$.subscribe(templates => {
        const template = templates.find(t => t.id === id);
        observer.next(template);
      });
    });
  }

  getTemplatesByCategory(category: string): Observable<Template[]> {
    return new Observable(observer => {
      this.templates$.subscribe(templates => {
        const filteredTemplates = templates.filter(t => t.category === category);
        observer.next(filteredTemplates);
      });
    });
  }

  getActiveTemplates(): Observable<Template[]> {
    return new Observable(observer => {
      this.templates$.subscribe(templates => {
        const activeTemplates = templates.filter(t => t.isActive);
        observer.next(activeTemplates);
      });
    });
  }

  updateTemplate(templateId: string, updates: Partial<Template>): void {
    const currentTemplates = this.templatesSubject.value;
    const updatedTemplates = currentTemplates.map(template => {
      if (template.id === templateId) {
        return { ...template, ...updates };
      }
      return template;
    });
    this.templatesSubject.next(updatedTemplates);
  }

  toggleTemplateStatus(templateId: string): void {
    const currentTemplates = this.templatesSubject.value;
    const updatedTemplates = currentTemplates.map(template => {
      if (template.id === templateId) {
        return { ...template, isActive: !template.isActive };
      }
      return template;
    });
    this.templatesSubject.next(updatedTemplates);
  }

  addTemplate(template: Omit<Template, 'id'>): void {
    const newTemplate: Template = {
      ...template,
      id: `TPL${Date.now()}`,
      lastModified: new Date()
    };
    const currentTemplates = this.templatesSubject.value;
    this.templatesSubject.next([newTemplate, ...currentTemplates]);
  }

  deleteTemplate(templateId: string): void {
    const currentTemplates = this.templatesSubject.value;
    const filteredTemplates = currentTemplates.filter(t => t.id !== templateId);
    this.templatesSubject.next(filteredTemplates);
  }

  getTemplatesSync(): Template[] {
    return this.templatesSubject.getValue();
  }
}
