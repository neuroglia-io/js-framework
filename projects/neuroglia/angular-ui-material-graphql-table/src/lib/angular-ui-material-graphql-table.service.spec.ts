import { TestBed } from '@angular/core/testing';

import { AngularUiMaterialGraphqlTableService } from './angular-ui-material-graphql-table.service';

describe('AngularUiMaterialGraphqlTableService', () => {
  let service: AngularUiMaterialGraphqlTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularUiMaterialGraphqlTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
