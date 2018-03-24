import { HomeComponent } from './partials/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './partials/search/search.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
