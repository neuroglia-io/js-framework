import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGuidComponent } from './filter-guid.component';

describe('FilterGuidComponent', () => {
  let component: FilterGuidComponent;
  let fixture: ComponentFixture<FilterGuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterGuidComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
