import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDateComponent } from './filter-date.component';

describe('FilterDateComponent', () => {
  let component: FilterDateComponent;
  let fixture: ComponentFixture<FilterDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
