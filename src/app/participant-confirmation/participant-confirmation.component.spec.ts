import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantConfirmationComponent } from './participant-confirmation.component';

describe('ParticipantConfirmationComponent', () => {
  let component: ParticipantConfirmationComponent;
  let fixture: ComponentFixture<ParticipantConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipantConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
