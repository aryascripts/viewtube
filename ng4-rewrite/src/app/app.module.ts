import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { WebviewDirective } from './directives/webview.directive';
import { ResizeDirective } from './directives/resizable.directive';

//Partials
import { AppComponent } from './app.component';
import { HomeComponent } from './partials/home/home.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { SearchComponent } from './partials/search/search.component';

//Components
import { PlaylistItemComponent } from './components/playlist-item/playlistitem.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';

//Services
import { GoogleApiService } from './providers/googleapi.service';
import { PlaylistsService } from './providers/playlist.service';
import { UserService } from './providers/user.service';
import { AppElectronService } from './providers/electron.service';

import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { SharedComponentsModule } from './modules/shared-components/shared-components.module';
import { DataStoreService } from './providers/data-store.service';
import { PlaylistViewComponent } from './partials/playlist-view/playlist-view.component';
import { HeaderComponent } from './components/header/header.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { PlaylistPreviewComponent } from './components/playlist-preview/playlist-preview.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    WebviewDirective,
    ResizeDirective,
    PlaylistItemComponent,
    PlaylistListComponent,
    SearchComponent,
    PlaylistDetailComponent,
    PlaylistViewComponent,
    HeaderComponent,
    PlayButtonComponent,
    PlaylistPreviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [AppElectronService, GoogleApiService, UserService, PlaylistsService, DataStoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
