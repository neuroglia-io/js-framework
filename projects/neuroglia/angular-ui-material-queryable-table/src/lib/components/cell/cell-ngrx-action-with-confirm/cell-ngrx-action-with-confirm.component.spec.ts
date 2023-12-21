import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellNgrxActionWithConfirmComponent } from './cell-ngrx-action-with-confirm.component';

describe('CellNgrxActionComponent', () => {
  let component: CellNgrxActionWithConfirmComponent;
  let fixture: ComponentFixture<CellNgrxActionWithConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellNgrxActionWithConfirmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellNgrxActionWithConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
