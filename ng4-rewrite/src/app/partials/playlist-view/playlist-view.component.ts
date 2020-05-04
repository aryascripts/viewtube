import { Component, OnInit } from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { PlaylistsService } from './../../providers/playlist.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss']
})
export class PlaylistViewComponent implements OnInit {

  constructor(    
    private playlistService: PlaylistsService,
    private route: ActivatedRoute) { }

  playlist: Playlist;

  ngOnInit() {
    this.route.params
      .subscribe(this.handleRouteParams.bind(this));
    this.playlistService.customPlaylists
      .subscribe(this.handleRouteParams.bind(this, this.route.snapshot.params));
    this.playlistService.myPlaylists
      .subscribe(this.handleRouteParams.bind(this, this.route.snapshot.params));
  }

  handleRouteParams(params: Params) {
    // We only nede to get the playlist when its
    // undefined or not the one we want from route
    if (!this.playlist || (this.playlist && this.playlist.id !== params.id)) {
      this.playlist = this.playlistService.getCachedPlaylistById(params.id);
    }
  }


}
