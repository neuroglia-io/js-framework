import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPresenterComponent } from './angular-ui-json-presenter.component';

describe('AngularUiJsonPresenterComponent', () => {
  let component: JsonPresenterComponent;
  let fixture: ComponentFixture<JsonPresenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JsonPresenterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
