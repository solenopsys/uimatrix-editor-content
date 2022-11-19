import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSelectSaveComponent } from './free-select-save.component';

describe('FreeSelectSaveComponent', () => {
  let component: FreeSelectSaveComponent;
  let fixture: ComponentFixture<FreeSelectSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeSelectSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeSelectSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
