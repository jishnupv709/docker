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
    this.http.get<any[]>('/items').subscribe((d) => (this.items = d));
  }

  addItem() {
    if (!this.newItemName) return;
    const payload = { name: this.newItemName, description: this.newItemDesc };
    this.http.post('/items', payload).subscribe(() => {
      this.newItemName = '';
      this.newItemDesc = '';
      this.loadItems();
    });
  }

  deleteItem(id: string) {
    this.http.delete('/items/' + id).subscribe(() => {
      this.loadItems();
    });
  }
}