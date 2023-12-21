import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSettingsComponent } from './column-settings.component';

describe('ColumnSettingsComponent', () => {
  let component: ColumnSettingsComponent;
  let fixture: ComponentFixture<ColumnSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
