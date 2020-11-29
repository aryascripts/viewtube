import { Injectable } from '@angular/core';
import DataStore from  'nedb';
import { Playlist } from '../models/Playlist';
import {PlaylistType} from './../models/AppConfig';
import { VideoMetadata } from '../models/VideoMetadata';
import { AppConfig, defaultConfig } from '../models/AppConfig';

export enum DocumentType {
  PLAYLIST = 'playlist',
  VIDEO = 'video-metadata',
  APP_CONFIG = 'app-config',
  LAST_PLAYED = 'last-played'
};

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  database: DataStore;

  constructor() {
    this.database = new DataStore({filename: './database-viewtube.db'});
    this.database.loadDatabase();
    // this.database.remove({}, {multi: true}, (err, docs) => {});
  }

  savePlaylist(playlist: Playlist) {
    return new Promise(async (resolve, reject) => {
      playlist.documentType = DocumentType.PLAYLIST;
      const existing: any[] = await this.findPlaylistById(playlist.id);
      if (existing.length) {
        // Update playlist
        this.database.update({id: playlist.id}, playlist, {}, (err, docs) => {
          if (err) reject(err);
          resolve(docs);
        });
  
      }
      else {
        this.database.insert(playlist, (err, newDocs) => {
          if (err) reject(err);
          resolve(newDocs);
        });
      }
    });
  }



  getCustomPlaylists(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.find({
          documentType: DocumentType.PLAYLIST, 
          "settings.type": PlaylistType.CUSTOM}, 
        (err, docs) => {
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


  findPlaylistById(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.find({id: id, documentType: DocumentType.PLAYLIST}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    });
  }


  private insert(document) {
    return new Promise((resolve, reject) => {
      this.database.insert(document, (err, docs) => {
        if(err) reject(err);
        resolve(docs);
      });
    });
  }

  getAppConfig(): Promise<AppConfig> {
    return new Promise((resolve, reject) => {
      this.database.find({documentType: DocumentType.APP_CONFIG}, async (err, docs) => {
        if (err) reject(err)
        if (!docs.length) {
          const config = {
            ...defaultConfig,
            documentType: DocumentType.APP_CONFIG
          };
          await this.insert(config);
          resolve(config);
        }
        else {
          resolve(docs[0]);
        }
      });
    })
  }

  async saveAppConfig(appConfig: AppConfig) {
    const old = await this.find({documentType: DocumentType.APP_CONFIG});
    console.log(old);
    return this.update(appConfig, old[0]);
  }

  removeWatchedVideos(videos: VideoMetadata[]) {
    const ids = videos.map(v => v.videoId);
    return new Promise((resolve, reject) => {
      this.database.remove({
        videoId: {$in: ids}
      }, {multi: true}, (err, docs) => {
        if (err) reject(err)
        resolve(docs);
      });
    });
  }

  removePlaylist(playlist: Playlist) {
    return new Promise((resolve, reject) => {
      this.database.remove({id: playlist.id}, {}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  find(doc: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.find(doc, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    });
  }

  update(newDoc: any, oldDoc: any) {
    return new Promise((resolve, reject) => {
      this.database.update(oldDoc, newDoc, (err, docsUpdated) => {
        if(err) reject(err);
        resolve(docsUpdated);
      });
    });
  }

  async saveLastPlayed(playlist: Playlist) {
    const docs = await this.find({documentType: DocumentType.LAST_PLAYED});
    const method = docs.length ? 'update' : 'insert';
    const doc = {documentType: DocumentType.LAST_PLAYED, playlistId: playlist.id};
    return await this[method](doc, docs[0]);
  }
}
