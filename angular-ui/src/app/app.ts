import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  items: any[] = [];
  newItemName = '';
  newItemDesc = '';

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.http.get<any[]>('/items').subscribe({
      next: (data) => {
        this.items = data;
        console.log('Items loaded:', this.items); // Helpful for debugging
      },
      error: (err) => console.error('Error loading items:', err)
    });
  }

  addItem() {
    if (!this.newItemName.trim()) return; // Prevent empty strings
    
    const payload = { name: this.newItemName, description: this.newItemDesc };
    
    this.http.post('/items', payload).subscribe({
      next: (res) => {
        console.log('Item added successfully:', res);
        // Clear the form
        this.newItemName = '';
        this.newItemDesc = '';
        // Instantly reload the list
        this.loadItems();
      },
      error: (err) => console.error('Error adding item:', err)
    });
  }

  deleteItem(id: string) {
    this.http.delete('/items/' + id).subscribe({
      next: () => {
        console.log('Item deleted successfully');
        // Instantly reload the list
        this.loadItems();
      },
      error: (err) => console.error('Error deleting item:', err)
    });
  }
}