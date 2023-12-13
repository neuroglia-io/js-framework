import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellLinkComponent } from './cell-link.component';

describe('CellLinkComponent', () => {
  let component: CellLinkComponent;
  let fixture: ComponentFixture<CellLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
