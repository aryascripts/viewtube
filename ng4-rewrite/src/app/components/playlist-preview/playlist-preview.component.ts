import { Component, OnInit, Input } from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { PagedVideos } from './../../models/PagedVideos';
import { PlaylistsService } from './../../providers/playlist.service';
import { PlaylistOrder } from './../../models/AppConfig';

@Component({
  selector: 'app-playlist-preview',
  templateUrl: './playlist-preview.component.html',
  styleUrls: ['./playlist-preview.component.scss']
})
export class PlaylistPreviewComponent {

  @Input() playlist: Playlist;
  @Input() paged: PagedVideos; 

  constructor(
    private playlistService: PlaylistsService
  ) { }

  getWatchedAndTotal() {
    const watched = Object.values(this.playlistService.watchedVideos)
                      .filter(video => (video.playlistId === this.playlist.id && 
                                        video.watched));
    return `${watched.length} / ${this.paged.totalCount}`;
  }

  getPlaylistType() {
    return this.playlist.order === PlaylistOrder.SEQUENTIAL ? 'Sequential' : 'Random';
  }

}
