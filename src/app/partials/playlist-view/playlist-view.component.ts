import { Component, OnInit } from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { PlaylistsService } from './../../providers/playlist.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PagedVideos } from './../../models/PagedVideos';
import {Video} from './../../models/Video';
import { Subscription } from 'rxjs';
import {take} from 'rxjs/operators';

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
  sub: Subscription;

  paged: PagedVideos;

  ngOnInit() {
    this.loading = true;
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

    if (!this.sub || (this.playlist && (this.playlist.id !== playlistId))) {
      if (this.sub) this.sub.unsubscribe();
      this.sub = this.playlistService.getPlaylistVideosSubject(playlistId)
                  .subscribe(this.handleVideosAddedChanged.bind(this, playlistId))
      this.playlistService.loadWatchedVideosFromDb(playlistId);
    }

    if (!this.playlist || (this.playlist && this.playlist.id !== playlistId)) {
      this.playlist = this.playlistService.getCachedPlaylistById(playlistId);
      
    }
  }

  handleVideosAddedChanged(playlistId: string, value: PagedVideos) {
    if (!value.videos.length) {
      this.playlistService.getVideosForPlaylist(playlistId);
    }
    this.paged = value;
    this.loading = false;
  }

  handleResume() {
    this.playlistService.handlePlaylistResume(this.playlist);
  }

  handlePlaylistSettings(video: Video) {
    if (this.playlist.settings.markPreviousWatched || this.playlist.settings.markNextUnwatched) {
      this.playlistService.videosMap[this.playlist.id]
        .pipe(take(1))
        .subscribe(value => {
          const index = value.videos.findIndex(v => v.id === video.id);
          const videoIds = [];
          for (let i = 0; i < index; i++) {
            videoIds.push(value.videos[i].id);
          }
          if (this.playlist.settings.markPreviousWatched) {
            this.playlistService.markVideosWatched(videoIds, this.playlist.id);
          }
          if (this.playlist.settings.markNextUnwatched) {
            this.playlistService.markUnwatchedExcept(videoIds, this.playlist.id);
          }     
        });
    }
  }

  loadMore() {
    this.loading = true;
    this.playlistService.getVideosForPlaylist(this.playlist.id);
  }

  showLoadingButton(): boolean {
    return !this.loading && (this.paged.videos.length < this.paged.totalCount);
  }

  playVideo(video: Video) {
    this.playlistService.playVideo(video, this.playlist.id);
    this.handlePlaylistSettings(video);
  }
}
