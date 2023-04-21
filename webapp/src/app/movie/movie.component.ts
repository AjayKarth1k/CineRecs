import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface MovieItem {
  Title: string;
  Genres: string;
  Runtime: string;
  IM: string;
  Director: string;
}

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  itemsPerPage = 5;
  currentPage = 1;
  items: MovieItem[] = [];
  pageNumbers: number[] = [];
  totalPages = 0;
  currentItems: MovieItem[] = [];

  constructor(private http: HttpClient) {}


  ngOnInit() {
    // Load items from CSV file or API endpoint
    this.http
      .get('assets/recmovie.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.items = data.split('\n').map((item) => {
          const columns = item.split(',');
          return {
            Title: columns[0],
            Genres: columns[1],
            Runtime: columns[2],
            IM: columns[3],
            Director: columns[4],
          };
        });
        // Calculate total number of pages
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);

        // Generate page numbers array for pagination
        this.pageNumbers = Array(this.totalPages)
          .fill(0)
          .map((x, i) => i + 1);

        // Display current page of items
        this.currentItems = this.items.slice(
          0,
          Math.min(this.itemsPerPage, this.items.length)
        );
      });
  }

  changePage(pageNum: number) {
    // Update current page and display new items
    this.currentPage = pageNum;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentItems = this.items.slice(
      startIndex,
      Math.min(startIndex + this.itemsPerPage, this.items.length)
    );
  }

  nextPage() {
    // Display next page of items
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.currentItems = this.items.slice(
        startIndex,
        Math.min(startIndex + this.itemsPerPage, this.items.length)
      );
    }
  }
  prevPage() {
    // Display previous page of items
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.currentItems = this.items.slice(
        startIndex,
        Math.min(startIndex + this.itemsPerPage, this.items.length)
      );
    }
  }
}
