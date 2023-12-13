import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterStringComponent } from './filter-string.component';

describe('FilterStringComponent', () => {
  let component: FilterStringComponent;
  let fixture: ComponentFixture<FilterStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterStringComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
