import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVoucherModalComponent } from './receipt-voucher-modal.component';

describe('ReceiptVoucherModalComponent', () => {
  let component: ReceiptVoucherModalComponent;
  let fixture: ComponentFixture<ReceiptVoucherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptVoucherModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
