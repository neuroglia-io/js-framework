import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCompiledExpressionComponent } from './cell-compiled-expression.component';

describe('CellCompiledExpressionComponent', () => {
  let component: CellCompiledExpressionComponent;
  let fixture: ComponentFixture<CellCompiledExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellCompiledExpressionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCompiledExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
