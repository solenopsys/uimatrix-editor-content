import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleTextComponent} from './simple-text.component';

describe('ParagraphComponent', () => {
  let component: SimpleTextComponent;
  let fixture: ComponentFixture<SimpleTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
