import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAverageComponent } from './grade-average.component';

describe('GradeAverageComponent', () => {
  let component: GradeAverageComponent;
  let fixture: ComponentFixture<GradeAverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradeAverageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
