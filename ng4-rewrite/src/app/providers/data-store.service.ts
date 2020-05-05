import { Injectable } from '@angular/core';
import DataStore from  'nedb';
import { Playlist, PlaylistType } from '../models/Playlist';
import { resolve } from 'url';
import { VideoMetadata } from '../models/VideoMetadata';

export enum DocumentType {
  PLAYLIST = 'playlist',
  VIDEO = 'video-metadata',
  APP_CONFIG = 'app-config'
};

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  database: DataStore;

  constructor() {
    this.database = new DataStore({filename: './database-viewtube.db'});
    this.database.loadDatabase();
  }

  savePlaylist(playlist: Playlist, type: PlaylistType) {
    playlist.type = type;
    playlist.documentType = DocumentType.PLAYLIST;
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

  getWatchedVideosForPlaylist(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.find({
        documentType: DocumentType.VIDEO,
        playlistId: id
      }, (err, docs) => {
        if (err) reject(err)
        resolve(docs);
      });
    });
  }

  saveWatchedVideo(document: VideoMetadata): Promise<any[]> {
    document.documentType = DocumentType.VIDEO;
    return new Promise(async (resolve, reject) => {
      const existing: any[] = await this.findWatchedVideosDoc(document);
      if (existing.length) {
        // UPDATE THE DOCUMENT
        this.database.update(existing[0], document, (err, docsUpdated) => {
          if (err) reject(err)
          resolve(docsUpdated)
        });
      }
      else {
        this.database.insert(document, (err, docs) => {
          if (err) reject(err);
          resolve(docs);
        });
      }
    });
  }

  findWatchedVideosDoc(document: VideoMetadata): Promise<any[]> {
    document.documentType = DocumentType.VIDEO;
    return new Promise((resolve, reject) => {
      this.database.find({videoId: document.videoId}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    });
  }
}
