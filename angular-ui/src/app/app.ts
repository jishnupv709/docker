import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // Inject Change Detection
  
  items: any[] = [];
  newItemName = '';
  newItemDesc = '';
  
  isLoading = false;
  toast = { show: false, message: '', type: 'success' };
  private toastTimeout: any;

  ngOnInit() {
    this.loadItems();
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast = { show: true, message, type };
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
      this.cdr.detectChanges(); // Update UI when toast disappears
    }, 3000);
  }

  loadItems() {
    this.isLoading = true;
    this.http.get<any[]>('/items').subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // <--- FORCE UI TO UPDATE IMMEDIATELY
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showToast('Failed to load items', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  addItem() {
    if (!this.newItemName.trim()) return;
    
    this.isLoading = true;
    const payload = { name: this.newItemName, description: this.newItemDesc };
    
    this.http.post('/items', payload).subscribe({
      next: () => {
        this.newItemName = '';
        this.newItemDesc = '';
        this.showToast('Item added successfully!', 'success');
        this.loadItems(); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showToast('Failed to add item', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteItem(id: string) {
    this.isLoading = true;
    this.http.delete('/items/' + id).subscribe({
      next: () => {
        this.showToast('Item deleted', 'success');
        this.loadItems();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showToast('Failed to delete item', 'error');
        this.cdr.detectChanges();
      }
    });
  }
}