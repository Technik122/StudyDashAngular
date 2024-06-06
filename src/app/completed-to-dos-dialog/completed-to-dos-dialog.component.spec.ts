import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedToDosDialogComponent } from './completed-to-dos-dialog.component';

describe('CompletedToDosDialogComponent', () => {
  let component: CompletedToDosDialogComponent;
  let fixture: ComponentFixture<CompletedToDosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedToDosDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletedToDosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
