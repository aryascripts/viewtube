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
    
  }
}
