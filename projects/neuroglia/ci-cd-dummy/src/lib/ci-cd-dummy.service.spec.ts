import { TestBed } from '@angular/core/testing';

import { CiCdDummyService } from './ci-cd-dummy.service';

describe('CiCdDummyService', () => {
  let service: CiCdDummyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiCdDummyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
