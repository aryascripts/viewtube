import { Injectable } from '@angular/core';
import { AppElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class YouTubeService {

  client: any;

  constructor(public electronService: AppElectronService) {
    console.log('setting listener...')
    this.electronService.listen('oauth2-client', this.setYoutubeService.bind(this))
  }

  setYoutubeService(event, client) {
    console.log(event, client);
    this.client = client;
  }

  getYoutubeClient() {
    console.log(this.client);
  }


}
