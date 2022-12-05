import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TextTypeSelectorComponent} from './text-type-selector.component';

describe('TextTypeSelectorComponent', () => {
  let component: TextTypeSelectorComponent;
  let fixture: ComponentFixture<TextTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextTypeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
