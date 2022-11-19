import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathTreeComponent } from './path-tree.component';

describe('PathTreeComponent', () => {
  let component: PathTreeComponent;
  let fixture: ComponentFixture<PathTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
