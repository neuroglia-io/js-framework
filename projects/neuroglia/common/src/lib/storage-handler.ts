import { IStorageEntry, IStorageHandler } from './models';
import { addMilliseconds, isBefore } from 'date-fns';

/**
 * Handles a storage entity and its lifetime
 */
export class StorageHandler<T> implements IStorageHandler<T> {

  /**
   * Handles a storage entity and its lifetime
   * @param key The assigned key in the storage
   * @param expiresIn The expiracy delay, if any
   * @param storage The storage (localStorage or sessionStorage) 
   */
  constructor(
    private key: string,
    private expiresIn: number | null = null,
    private storage: Storage = window.localStorage
  ) {}

  setItem(value: T): void {
    const createdAt = (new Date()).getTime();
    let expiresAt: number | null = null;
    if (this.expiresIn) {
      expiresAt = addMilliseconds(createdAt, this.expiresIn).getTime();
    }
    const entry: IStorageEntry<T> = {
      createdAt,
      expiresAt,
      value
    };
    this.storage.setItem(this.key, JSON.stringify(entry));
  }

  getItem(): T | undefined {
    const strEntry = this.storage.getItem(this.key);
    if (!strEntry) return;
    const entry: IStorageEntry<T> = JSON.parse(strEntry);
    if (!entry) return;
    if (!this.expiresIn || !entry.expiresAt) return entry.value;
    const now = (new Date()).getTime();
    if (entry.expiresAt === now || isBefore(now, entry.expiresAt)) return entry.value;
    else console.info(`Storage with key '${this.key}' expired (${entry.expiresAt}).`);
    return;
  }

  removeItem(): void {
    this.storage.removeItem(this.key);
  }

  clear(): void {
    this.removeItem();
  }
}