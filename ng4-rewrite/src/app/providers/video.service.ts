import { Injectable } from '@angular/core';
import { Video } from '../models/Video';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private electronService: AppElectronService
  ) { }

  playVideo(video: Video) {
    this.electronService.send(EventType.PLAY_VIDEO, {
      videoId:  video.id,
      time: '0'
    });
  }
}
