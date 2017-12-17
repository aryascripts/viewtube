import { HomeComponent } from './components/home/home.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { VideoComponent } from './components/video/video.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {path: '', 				component: LoadingComponent},
    {path: 'home', 			component: HomeComponent},
    {path: 'settings', 		component: SettingsComponent},
    {path: 'playlist/:id', 	component: PlaylistComponent},
    {path: 'video/:id/:time', 		component: VideoComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
