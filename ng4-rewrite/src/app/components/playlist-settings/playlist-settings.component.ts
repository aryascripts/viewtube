import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Playlist } from './../../models/Playlist';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlaylistsService } from './../../providers/playlist.service';

@Component({
  selector: 'app-playlist-settings',
  templateUrl: './playlist-settings.component.html',
  styleUrls: ['./playlist-settings.component.scss']
})
export class PlaylistSettingsComponent implements OnInit, OnDestroy {

  @Input() playlist: Playlist;
  settingsOpen: boolean = false;
  settingsForm: FormGroup;
  sub: Subscription;

  constructor(
     private playlistService: PlaylistsService
  ) { }
  ngOnInit() {
    this.settingsForm = new FormGroup({
      playlistOrder: new FormControl(this.playlist.settings.order),
      resumeBehavior: new FormControl(this.playlist.settings.resumeBehavior),
      markNext: new FormControl(this.playlist.settings.markNextUnwatched),
      markPrevious: new FormControl(this.playlist.settings.markPreviousWatched)
    });

    this.sub = this.settingsForm.valueChanges.subscribe(this.handleFormChange.bind(this))
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  handleFormChange(value) {
    this.playlist.settings = {
      ...this.playlist.settings,
      resumeBehavior: value.resumeBehavior,
      order: value.playlistOrder,
      markNextUnwatched: value.markNext === 'true' || value.markNext === true,
      markPreviousWatched: value.markPrevious === 'true' || value.markPrevious === true
    };
    console.log('inside form', JSON.stringify(value))
    this.playlistService.updatePlaylist(this.playlist);
  }

}
