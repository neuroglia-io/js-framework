import { TestBed } from '@angular/core/testing';

import { StorageHandlerFactoryService } from './storage-handler-factory.service';

describe('StorageHandlerFactoryService', () => {
  let service: StorageHandlerFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [StorageHandlerFactoryService] });
    service = TestBed.inject(StorageHandlerFactoryService);
  });

  afterAll(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('factory returned instance', () => {
    const instance = service.create('key');
    expect(instance).toBeTruthy();
  });

});
