import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { TemplatesComponent } from './components/templates/templates.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'documents/:id', component: DocumentsComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'memos', component: DashboardComponent }, // Placeholder for memos page
  { path: 'analytics', component: DashboardComponent }, // Placeholder for analytics page
  { path: 'template', component: TemplatesComponent }, // Use only 'template' route
  { path: '**', redirectTo: '/dashboard' }
];
