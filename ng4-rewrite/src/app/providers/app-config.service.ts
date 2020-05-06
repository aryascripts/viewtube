import { Injectable } from '@angular/core';
import { DataStoreService } from './data-store.service';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../models/AppConfig';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  
  config: BehaviorSubject<AppConfig> = new BehaviorSubject<AppConfig>(undefined);

  constructor(
    private database: DataStoreService
  ) {
    this.database.getAppConfig()
      .then((config) => {
        this.config.next(config);
      });
  }
}
