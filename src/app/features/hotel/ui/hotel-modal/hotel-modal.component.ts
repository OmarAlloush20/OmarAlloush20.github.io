import { Component, inject, Input } from '@angular/core';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-modal',
  standalone: true,
  imports: [],
  templateUrl: './hotel-modal.component.html',
  styleUrl: './hotel-modal.component.scss'
})
export class HotelModalComponent  extends FormComponent {
  // Overrides:
  override get value() {
    return this.hotel
  }

  override form : FormGroup;

  protected override modalRef = inject(MatDialogRef<HotelModalComponent>);
  
  // Component

  @Input() title : string = 'Hotel'

  @Input() hotel? : Partial<Hotel>;

  constructor(private fb : FormBuilder) {
    super();
    this.form = this.fb.group({
      name : ['', Validators.required],
      rating: [2, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      phone: ['', [Validators.required]],
      contacPersonName: ['', [Validators.required]],
      email: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    if(this.hotel) {
      this.form.patchValue({
        name: this.hotel.name,
        rating: this.hotel.rating,
        phone: this.hotel.phone,
        contacPersonName: this.hotel.contacPersonName,
        email: this.hotel.email,
      })
    }
  }

}
