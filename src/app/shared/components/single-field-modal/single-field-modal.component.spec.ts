import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFieldModalComponent } from './single-field-modal.component';

describe('SingleFieldModalComponent', () => {
  let component: SingleFieldModalComponent;
  let fixture: ComponentFixture<SingleFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleFieldModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
