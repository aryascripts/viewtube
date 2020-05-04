import { Component, OnInit } from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { PlaylistsService } from './../../providers/playlist.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PagedVideos } from './../../models/PagedVideos';

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
  loading: boolean;
  sub: any;

  paged: PagedVideos;

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
    const playlistId = params.id;
    if (!this.playlist || (this.playlist && this.playlist.id !== playlistId)) {
      this.playlist = this.playlistService.getCachedPlaylistById(playlistId);
    }

    if (!this.sub || (this.playlist && (this.playlist.id !== playlistId))) {
      console.log('subscribing...');
      this.sub = this.playlistService.getPlaylistVideosSubject(playlistId)
                  .subscribe(this.handleVideosAddedChanged.bind(this, playlistId))
    }
    
  }

  handleVideosAddedChanged(playlistId: string, value: PagedVideos) {
    if (!value.videos.length) {
      this.playlistService.getVideosForPlaylist(playlistId);
    }
    this.paged = value;
  }

  handleResume() {
    console.log('resuming...');
  }
}
