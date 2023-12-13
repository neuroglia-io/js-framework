import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEnumComponent } from './filter-enum.component';

describe('FilterEnumComponent', () => {
  let component: FilterEnumComponent;
  let fixture: ComponentFixture<FilterEnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterEnumComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
