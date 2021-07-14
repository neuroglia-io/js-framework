import { Injectable } from '@angular/core';

import { StorageHandler, IStorageHandler } from '@neuroglia/common';

/**
 * The injectable service used to create IStorageHandlers
 */
@Injectable({
  providedIn: 'root'
})
export class StorageHandlerFactoryService {

  /**
   * Creates a new IStorageHandler
   * @param key The assigned key in the storage
   * @param expiresIn The expiracy delay, if any
   * @param storage The storage (localStorage or sessionStorage)
   */
  create<T>(key: string, expiresIn: number | null = null, storage: Storage = window.localStorage): IStorageHandler<T> {
    return new StorageHandler(key, expiresIn, storage);
  }

}