import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatbotService } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-underwriter-assist',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './underwriter-assist.component.html',
  styleUrls: ['./underwriter-assist.component.scss'],
  providers: [ChatbotService]
})
export class UnderwriterAssistComponent implements OnDestroy {
  isCollapsed = false;
  position = { top: 100, left: 20 };
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  userMessage: string = '';
  isOpen = false;
  chatHistory: { prompt: string; response: string }[] = [];
  attachedContext: string = '';

  initialWidth = 400;
  minWidth = 200;
  maxWidth = 600;
  width = this.initialWidth;
  resizing = false;
  isDragging = false;
  dragStart = { x: 0, y: 0 };
  resizingEdge: string | null = null;

  height = window.innerHeight * 0.6;
  minHeight = 200;
  maxHeight = window.innerHeight;

  chatbotSub?: Subscription;

  constructor(private chatbotService: ChatbotService) {
    window.addEventListener('openAssistChat', () => {
      this.toggleAssist();
    });
  }

  ngOnInit() {
    // Set initial position based on viewport size
    const chatHeight = this.height;
    const margin = 24;
    this.position = {
      top: window.innerHeight - chatHeight - margin,
      left: window.innerWidth - this.initialWidth - margin
    };
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.dragStart.x = event.clientX - (this.position.left || 0);
    this.dragStart.y = event.clientY - (this.position.top || 0);
    event.preventDefault();
    event.stopPropagation();
  }

  startResize(event: MouseEvent, edge: string) {
    this.resizing = true;
    this.resizingEdge = edge;
    this.dragStart.x = event.clientX;
    this.dragStart.y = event.clientY;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (this.isDragging) {
      let newLeft = event.clientX - this.dragStart.x + this.position.left;
      let newTop = event.clientY - this.dragStart.y + this.position.top;
      // Clamp to viewport
      newLeft = Math.max(0, Math.min(window.innerWidth - this.width, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - this.height, newTop));
      this.position.left = newLeft;
      this.position.top = newTop;
      this.dragStart.x = event.clientX;
      this.dragStart.y = event.clientY;
    }
    if (this.resizing && this.resizingEdge) {
      const dx = event.clientX - this.dragStart.x;
      const dy = event.clientY - this.dragStart.y;
      if (this.resizingEdge === 'right') {
        this.width = Math.max(this.minWidth, Math.min(this.maxWidth, this.width + dx));
      } else if (this.resizingEdge === 'left') {
        const newWidth = this.width - dx;
        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
          this.width = newWidth;
          this.position.left += dx;
        }
      } else if (this.resizingEdge === 'bottom') {
        const newHeight = this.height + dy;
        if (newHeight >= this.minHeight && newHeight <= this.maxHeight) {
          this.height = newHeight;
        }
      } else if (this.resizingEdge === 'top') {
        const newHeight = this.height - dy;
        if (newHeight >= this.minHeight && newHeight <= this.maxHeight) {
          this.height = newHeight;
          this.position.top += dy;
        }
      }
      this.dragStart.x = event.clientX;
      this.dragStart.y = event.clientY;
    }
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.isDragging = false;
    this.resizing = false;
    this.resizingEdge = null;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.position = { top: 20, left: window.innerWidth - 350 };
    } else {
      this.position = { top: 100, left: 20 };
    }
  }

  toggleAssist() {
    this.isOpen = !this.isOpen;
  }

  closeChat() {
    this.isOpen = false;
  }

  attachContext(context: string) {
    this.attachedContext = context;
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      const userMsg = this.userMessage;
      this.chatHistory.push({ prompt: userMsg, response: '...' });
      this.userMessage = '';
      this.chatbotSub = this.chatbotService.sendMessage(userMsg + (this.attachedContext ? (' | Context: ' + this.attachedContext) : ''))
        .subscribe({
          next: (res) => {
            const idx = this.chatHistory.findIndex(h => h.prompt === userMsg && h.response === '...');
            if (idx !== -1) this.chatHistory[idx].response = res.reply;
          },
          error: () => {
            const idx = this.chatHistory.findIndex(h => h.prompt === userMsg && h.response === '...');
            if (idx !== -1) this.chatHistory[idx].response = 'Error: Unable to get response.';
          }
        });
      setTimeout(() => {
        const textarea = document.querySelector('.chat-input textarea[matInput]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = '48px';
        }
      }, 0);
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoGrow(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  ngOnDestroy() {
    if (this.chatbotSub) this.chatbotSub.unsubscribe();
  }

  // TODO: Connect to AWS Bedrock LLM API
}
