import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportModalComponent } from './airport-modal.component';

describe('AirportModalComponent', () => {
  let component: AirportModalComponent;
  let fixture: ComponentFixture<AirportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
