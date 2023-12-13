import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellDefaultComponent } from './cell-default.component';

describe('CellDefaultComponent', () => {
  let component: CellDefaultComponent;
  let fixture: ComponentFixture<CellDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellDefaultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
