import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedCoursesDialogComponent } from './completed-courses-dialog.component';

describe('CompletedCoursesDialogComponent', () => {
  let component: CompletedCoursesDialogComponent;
  let fixture: ComponentFixture<CompletedCoursesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedCoursesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletedCoursesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
