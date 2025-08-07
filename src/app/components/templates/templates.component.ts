import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentViewerDialogComponent } from '../documents/document-viewer-dialog.component';
import { AddTemplateDialogComponent } from './add-template-dialog.component';

@Component({
  selector: 'app-templates',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Template> = new MatTableDataSource<Template>([]);
  displayedColumns: string[] = [
    'name', 
    'category', 
    'documentType', 
    'version', 
    'status', 
    'lastModified', 
    'actions'
  ];

  // Filter options
  selectedCategory: string = 'all';
  searchTerm: string = '';
  showInactive: boolean = false;

  // Column-specific filters
  columnFilters: any = {
    name: '',
    category: '',
    documentType: '',
    version: '',
    lastModified: ''
  };

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Legal Document', label: 'Legal Documents' },
    { value: 'Financial Document', label: 'Financial Documents' },
    { value: 'Compliance Document', label: 'Compliance Documents' },
    { value: 'Other', label: 'Other' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  constructor(private templateService: TemplateService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe(templates => {
      this.dataSource.data = templates;
      this.setupTable();
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.setupTable();
  }

  setupTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom filter predicate
    this.dataSource.filterPredicate = (data: Template, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchStr) ||
        data.description.toLowerCase().includes(searchStr) ||
        data.documentType.toLowerCase().includes(searchStr) ||
        data.category.toLowerCase().includes(searchStr) ||
        data.id.toLowerCase().includes(searchStr)
      );
    };
  }

  onColumnFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData: Template[] = this.templateService.getTemplatesSync();

    // Global search
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.documentType.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search)
      );
    }

    // Per-column filters
    if (this.columnFilters.name) {
      filteredData = filteredData.filter((t: Template) => t.name.toLowerCase().includes(this.columnFilters.name.toLowerCase()));
    }
    if (this.columnFilters.category) {
      filteredData = filteredData.filter((t: Template) => t.category === this.columnFilters.category);
    }
    if (this.columnFilters.documentType) {
      filteredData = filteredData.filter((t: Template) => t.documentType.toLowerCase().includes(this.columnFilters.documentType.toLowerCase()));
    }
    if (this.columnFilters.version) {
      filteredData = filteredData.filter((t: Template) => t.version.toLowerCase().includes(this.columnFilters.version.toLowerCase()));
    }
    if (this.columnFilters.lastModified) {
      filteredData = filteredData.filter((t: Template) => t.lastModified && t.lastModified.toString().toLowerCase().includes(this.columnFilters.lastModified.toLowerCase()));
    }

    // Category filter
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      filteredData = filteredData.filter(t => t.category === this.selectedCategory);
    }
    // Show inactive
    if (!this.showInactive) {
      filteredData = filteredData.filter(t => t.isActive);
    }

    this.dataSource.data = filteredData;
    this.dataSource._updateChangeSubscription();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onShowInactiveChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchTerm = '';
    this.showInactive = false;
    this.columnFilters = {
      name: '',
      category: '',
      documentType: '',
      version: '',
      lastModified: ''
    };
    this.applyFilters();
  }

  toggleTemplateStatus(template: Template): void {
    this.templateService.toggleTemplateStatus(template.id);
  }

  editTemplate(template: Template): void {
    console.log('Edit template:', template.id);
    // TODO: Implement edit functionality
  }

  deleteTemplate(template: Template): void {
    if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
      this.templateService.deleteTemplate(template.id);
    }
  }

  viewTemplateDetails(template: Template): void {
    if (!template.signedUrl) {
      alert('No signed document available for this template.');
      return;
    }
    let type = '';
    if (template.signedUrl.endsWith('.pdf')) {
      type = 'application/pdf';
    } else if (template.signedUrl.endsWith('.docx')) {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    this.dialog.open(DocumentViewerDialogComponent, {
      width: '700px',
      data: {
        url: template.signedUrl,
        type
      }
    });
  }

  onAddTemplate(): void {
    const dialogRef = this.dialog.open(AddTemplateDialogComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templateService.addTemplate(result);
        this.applyFilters();
      }
    });
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Legal Document':
        return 'primary';
      case 'Financial Document':
        return 'accent';
      case 'Compliance Document':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'accent' : 'warn';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  getCategoryCount(category: string): number {
    if (category === 'all') {
      return this.dataSource.data.length;
    }
    return this.dataSource.data.filter(template => template.category === category).length;
  }

  isAnyFilterApplied(): boolean {
    return this.selectedCategory !== 'all' ||
      !!this.searchTerm ||
      this.showInactive ||
      Object.values(this.columnFilters).some(val => !!val);
  }

  getActiveCount(): number {
    return this.dataSource.data.filter(template => template.isActive).length;
  }

  getTotalCount(): number {
    return this.dataSource.data.length;
  }
}
