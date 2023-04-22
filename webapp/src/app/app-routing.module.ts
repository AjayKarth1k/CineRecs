import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './movie/movie.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './loading/loading.component';

const routes: Routes = [
  {path:'movie', component:MovieComponent},
  {path:'', component:HomeComponent},
  {path:'loading', component:LoadingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
