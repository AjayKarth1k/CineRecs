import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  movieName: string = '';
  movieSuggestions: string[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}
  submitMovieName() {
    this.http
      .post<any>('http://127.0.0.1:5000/home', { movie_name: this.movieName })
      .subscribe(
        (response) => {
          console.log(response);
          if (response.error) {
            this.errorMessage = response.error;
            this.movieSuggestions = [];
          } else {
            this.errorMessage = '';
            this.movieSuggestions = response.movie_suggestions;
          }
        },
        (error) => {
          console.log(error);
          this.errorMessage =
            'An error occurred while fetching movie suggestions. Please try again.';
          this.movieSuggestions = [];
        }
      );
  }
}
