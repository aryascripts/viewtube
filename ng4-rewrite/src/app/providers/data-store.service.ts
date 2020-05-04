import { Injectable } from '@angular/core';
import DataStore from  'nedb';
import { Playlist, PlaylistType } from '../models/Playlist';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  database;

  constructor() {
    this.database = new DataStore({filename: './database-viewtube.db'});
    this.database.loadDatabase();
  }

  log() {
    this.database.find({test: 1}, (err, docs) => {
      console.log('docs', err, docs);
    });
  }

  savePlaylist(playlist: Playlist, type: PlaylistType) {
    playlist.type = type;
    this.database.insert(playlist, (err, newDocs) => {
      console.log('inserted one', newDocs);
    });
  }

  getCustomPlaylists(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.find({type: PlaylistType.CUSTOM}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    })
  }
}
