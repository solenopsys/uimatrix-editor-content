import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSelectComponent } from './free-select.component';

describe('FreeSelectComponent', () => {
  let component: FreeSelectComponent;
  let fixture: ComponentFixture<FreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
