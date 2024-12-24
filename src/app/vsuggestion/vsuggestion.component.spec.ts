import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsuggestionComponent } from './vsuggestion.component';

describe('VsuggestionComponent', () => {
  let component: VsuggestionComponent;
  let fixture: ComponentFixture<VsuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsuggestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
