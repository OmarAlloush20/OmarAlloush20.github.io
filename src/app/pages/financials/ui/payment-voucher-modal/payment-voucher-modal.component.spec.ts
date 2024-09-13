import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherModalComponent } from './payment-voucher-modal.component';

describe('PaymentVoucherModalComponent', () => {
  let component: PaymentVoucherModalComponent;
  let fixture: ComponentFixture<PaymentVoucherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentVoucherModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
