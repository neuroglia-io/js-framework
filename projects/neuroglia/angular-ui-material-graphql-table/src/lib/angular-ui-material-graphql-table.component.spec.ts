import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularUiMaterialGraphqlTableComponent } from './angular-ui-material-graphql-table.component';

describe('AngularUiMaterialGraphqlTableComponent', () => {
  let component: AngularUiMaterialGraphqlTableComponent;
  let fixture: ComponentFixture<AngularUiMaterialGraphqlTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularUiMaterialGraphqlTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularUiMaterialGraphqlTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
