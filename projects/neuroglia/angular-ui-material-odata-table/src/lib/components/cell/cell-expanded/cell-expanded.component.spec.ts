import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellExpandedComponent } from './cell-expanded.component';

describe('CellExpandedComponent', () => {
  let component: CellExpandedComponent;
  let fixture: ComponentFixture<CellExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellExpandedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
