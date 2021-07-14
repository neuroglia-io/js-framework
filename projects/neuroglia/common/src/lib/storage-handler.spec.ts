import { StorageHandler } from './storage-handler';

describe('StorageHandler', () => {
  let lifetime = 1000;
  let localStorageKey = 'local_storage_test';
  let localStorageHandler: StorageHandler<string>;
  let sessionStorageKey = 'session_storage_test';
  let sessionStorageHandler: StorageHandler<string>;

  beforeAll((done) => {
    localStorageHandler = new StorageHandler<string>(localStorageKey, lifetime);
    sessionStorageHandler = new StorageHandler<string>(sessionStorageKey, lifetime, window.sessionStorage);
    done();
  }, 5000);

  afterAll(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('[localStorage] should be created', () => {
    expect(localStorageHandler).toBeTruthy();
  });

  it('[localStorage] should get an empty item', () => {
    const entry = localStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.localStorage.getItem(localStorageKey)).toBeFalsy();
  });

  it('[localStorage] should set an item', () => {
    const value = 'hello world';
    localStorageHandler.setItem(value);
    const entry = localStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.localStorage.getItem(localStorageKey)).toBeTruthy();
    localStorageHandler.clear();
  });

  it('[localStorage] should expire', (done) => {
    const value = 'hello world';
    localStorageHandler.setItem(value);
    const entry = localStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.localStorage.getItem(localStorageKey)).toBeTruthy();
    setTimeout(() => {
      const entry = localStorageHandler.getItem();
      expect(entry).toBeFalsy();
      expect(window.localStorage.getItem(localStorageKey)).toBeTruthy();
      localStorageHandler.clear();
      done();
    }, lifetime * 1.5);
  });

  it('[localStorage] should remove an item', () => {
    const value = 'hello world';
    localStorageHandler.setItem(value);
    let entry = localStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.localStorage.getItem(localStorageKey)).toBeTruthy();
    localStorageHandler.removeItem();
    entry = localStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.localStorage.getItem(localStorageKey)).toBeFalsy();
  });

  it('[localStorage] should clear an item', () => {
    const value = 'hello world';
    localStorageHandler.setItem(value);
    let entry = localStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.localStorage.getItem(localStorageKey)).toBeTruthy();
    localStorageHandler.clear();
    entry = localStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.localStorage.getItem(localStorageKey)).toBeFalsy();
  });

  it('[sessionStorage] should be created', () => {
    expect(sessionStorageHandler).toBeTruthy();
  });

  it('[sessionStorage] should get an empty item', () => {
    const entry = sessionStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeFalsy();
  });

  it('[sessionStorage] should set an item', () => {
    const value = 'hello world';
    sessionStorageHandler.setItem(value);
    const entry = sessionStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeTruthy();
    sessionStorageHandler.clear();
  });

  it('[sessionStorage] should expire', (done) => {
    const value = 'hello world';
    sessionStorageHandler.setItem(value);
    const entry = sessionStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeTruthy();
    setTimeout(() => {
      const entry = sessionStorageHandler.getItem();
      expect(entry).toBeFalsy();
      expect(window.sessionStorage.getItem(sessionStorageKey)).toBeTruthy();
      sessionStorageHandler.clear();
      done();
    }, lifetime * 1.5);
  });

  it('[sessionStorage] should remove an item', () => {
    const value = 'hello world';
    sessionStorageHandler.setItem(value);
    let entry = sessionStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeTruthy();
    sessionStorageHandler.removeItem();
    entry = sessionStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeFalsy();
  });

  it('[sessionStorage] should clear an item', () => {
    const value = 'hello world';
    sessionStorageHandler.setItem(value);
    let entry = sessionStorageHandler.getItem();
    expect(entry).toBe(value);
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeTruthy();
    sessionStorageHandler.clear();
    entry = sessionStorageHandler.getItem();
    expect(entry).toBeFalsy();
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeFalsy();
  });

});
