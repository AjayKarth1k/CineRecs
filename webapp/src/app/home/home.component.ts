import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  movieName: string = '';
  suggestedMovies: any[] = []; // to store the suggested movies with their details and poster URLs
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  submitMovieName() {
    this.http
      .post<any>('http://127.0.0.1:5000/home', { movie_name: this.movieName })
      .subscribe(
        (response) => {
          console.log(response);
          if (response.error) {
            this.errorMessage = response.error;
            this.suggestedMovies = [];
          } else {
            this.errorMessage = '';
            this.suggestedMovies = response; // store the suggested movies in the suggestedMovies array
            let navigationExtras: NavigationExtras = {
              state: {
                suggestedMovies: this.suggestedMovies
              }
            };
            this.router.navigate(['/movie'], navigationExtras); // redirect to the MovieComponent with the suggestedMovies array passed as state
          }
        },
        (error) => {
          console.log(error);
          this.errorMessage =
            'An error occurred while fetching movie suggestions. Please try again.';
          this.suggestedMovies = [];
        }
      );
  }
}
