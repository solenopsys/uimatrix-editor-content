import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphMoveComponent } from './paragraph-move.component';

describe('ParagraphMoveComponent', () => {
  let component: ParagraphMoveComponent;
  let fixture: ComponentFixture<ParagraphMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParagraphMoveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParagraphMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
