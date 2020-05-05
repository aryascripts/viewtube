import { Injectable } from '@angular/core';
import { Video } from '../models/Video';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';
import { PlaylistsService } from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private electronService: AppElectronService,
    private playlistService: PlaylistsService
  ) {
    this.electronService.listen(EventType.UPDATE_TIME, this.handleUpdateTime.bind(this));
  }

  playVideo(video: Video) {
    const lastPlayTime = this.playlistService.watchedVideos[video.id] 
    ? this.playlistService.watchedVideos[video.id].seconds : 0;
    this.electronService.send(EventType.PLAY_VIDEO, {
      videoId:  video.id,
      time: lastPlayTime
    });
  }

  handleUpdateTime(event, data: {videoId: string, time: number}) {
    this.playlistService.updateVideoTime(data.videoId, data.time);
  }
}
