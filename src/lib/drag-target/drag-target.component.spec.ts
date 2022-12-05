import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragTargetComponent } from './drag-target.component';

describe('DragTargetComponent', () => {
  let component: DragTargetComponent;
  let fixture: ComponentFixture<DragTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragTargetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
