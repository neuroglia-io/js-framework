import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiCdDummyComponent } from './ci-cd-dummy.component';

describe('CiCdDummyComponent', () => {
  let component: CiCdDummyComponent;
  let fixture: ComponentFixture<CiCdDummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CiCdDummyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiCdDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
