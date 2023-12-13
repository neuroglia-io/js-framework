import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellNgrxActionComponent } from './cell-ngrx-action.component';

describe('CellNgrxActionComponent', () => {
  let component: CellNgrxActionComponent;
  let fixture: ComponentFixture<CellNgrxActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellNgrxActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellNgrxActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
