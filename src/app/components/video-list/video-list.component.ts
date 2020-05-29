import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../models/Video';
import { PlaylistsService } from './../../providers/playlist.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  @Input() videos: Video[];
  @Output() videoClicked: EventEmitter<Video> = new EventEmitter();

  constructor(
    private playlistService: PlaylistsService
  ) { }
  ngOnInit() {}

  handleVideoClick(video: Video) {
    this.videoClicked.emit(video);
  }

  getVideoTime(id: string) {
    const metadata = this.playlistService.watchedVideos[id];
    return metadata ? metadata.seconds : 0;
  }

  getVideoPercentage(video: Video) {
    const metadata = this.playlistService.watchedVideos[video.id];
    if (metadata && metadata.watched) {
      return '100%';
    }
    const seconds = this.getVideoTime(video.id);
    if (metadata && seconds) {
      return `${Math.floor((seconds / metadata.totalSeconds) * 100)}%`;
    }
    return '0';
  }

}
