import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  suggestedMovies: any[] = []; // to store the suggested movies with their details and poster URLs

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (history.state && history.state.suggestedMovies) {
      this.suggestedMovies = history.state.suggestedMovies; // retrieve the suggestedMovies array from the route's state object
      console.log(this.suggestedMovies); // do whatever you want with the suggestedMovies array
    }
  }
}
