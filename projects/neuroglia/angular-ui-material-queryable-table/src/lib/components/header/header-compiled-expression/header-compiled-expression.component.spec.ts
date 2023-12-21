import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCompiledExpressionComponent } from './header-compiled-expression.component';

describe('HeaderCompiledExpressionComponent', () => {
  let component: HeaderCompiledExpressionComponent;
  let fixture: ComponentFixture<HeaderCompiledExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCompiledExpressionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCompiledExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
