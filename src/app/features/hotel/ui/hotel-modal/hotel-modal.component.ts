import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Hotel } from '../../models/hotel.model';
import { CommonModule } from '@angular/common';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';
import { phoneNumberValidator } from '../../../../core/utils/validators.utils';
import { MultiSelectComponent } from "../../../../shared/components/multi-select/multi-select.component";

@Component({
  selector: 'app-hotel-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, StarRatingModule, MultiSelectComponent],
  providers: [StarRatingConfigService],
  templateUrl: './hotel-modal.component.html',
  styleUrl: './hotel-modal.component.scss',
})
export class HotelModalComponent extends FormComponent {
  // Overrides:
  override get value() {
    return this.hotel;
  }

  override form: FormGroup;

  protected override modalRef = inject(MatDialogRef<HotelModalComponent>);

  // Component

  @Input() title: string = 'Hotel';

  @Input() hotel?: Partial<Hotel>;

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      name: ['', Validators.required],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      phone: ['', [Validators.required, phoneNumberValidator]],
      contactPersonName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roomTypes: [[], [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.hotel) {
      this.form.patchValue({
        name: this.hotel.name,
        rating: this.hotel.rating ?? 1,
        phone: this.hotel.phone,
        contactPersonName: this.hotel.contacPersonName,
        email: this.hotel.email,
        // roomTypes: ['Room A']
      });
    }
    this.form.valueChanges.subscribe((value) => {
      console.log(JSON.stringify(value))
    });
  }
  
}
