import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExpressionComponent } from './filter-expression.component';

describe('FilterExpressionComponent', () => {
  let component: FilterExpressionComponent;
  let fixture: ComponentFixture<FilterExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterExpressionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
