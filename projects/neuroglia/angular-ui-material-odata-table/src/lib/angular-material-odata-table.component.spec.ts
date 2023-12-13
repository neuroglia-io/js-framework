import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeurogliaNgMatDataTableComponent } from './angular-ui-material-odata-table.component';

describe('NeurogliaNgMatDataTableComponent', () => {
  let component: NeurogliaNgMatDataTableComponent;
  let fixture: ComponentFixture<NeurogliaNgMatDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeurogliaNgMatDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurogliaNgMatDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
