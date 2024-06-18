import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationRvspComponent } from './invitation-rvsp.component';

describe('InvitationRvspComponent', () => {
  let component: InvitationRvspComponent;
  let fixture: ComponentFixture<InvitationRvspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationRvspComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationRvspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
