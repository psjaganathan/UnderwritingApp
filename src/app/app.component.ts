import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutService } from './services/layout.service';
import { UnderwriterAssistComponent } from './components/underwriter-assist/underwriter-assist.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    UnderwriterAssistComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'underwriting-app';
  sidebarCollapsed = false;

  constructor(private layoutService: LayoutService) {
    this.layoutService.sidebarCollapsed$.subscribe(
      collapsed => this.sidebarCollapsed = collapsed
    );
  }
}
