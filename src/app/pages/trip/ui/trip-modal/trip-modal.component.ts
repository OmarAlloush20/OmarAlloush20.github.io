import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Trip } from '../../../trips/models/trip.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './trip-modal.component.html',
  styleUrl: './trip-modal.component.scss',
})
export class TripModalComponent implements OnInit {
  @Input() title: string = 'Trip';

  @Input() trip?: Trip;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tripsService: TripService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TripModalComponent>
  ) {
    this.form = this.fb.group({
      customerTrip: [undefined, Validators.required],
      tripType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if(this.trip) {
      
    this.form.patchValue({
      customerTrip: this.trip.customerTrip,
      tripType: this.trip.tripType,
      startDate: this.trip.startDate,
      endDate: this.trip.endDate,
      totalAmount: this.trip.totalAmount,
    });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const trip: Trip = {
        customerTrip: this.form.value.customerTrip,
        tripType: this.form.value.tripType,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        totalAmount: this.form.value.totalAmount,
      };

      this.tripsService.addTrip(trip).subscribe({
        next: (res) => {
          this.toastr.success('Trip added successfully');
          this.dialogRef.close(trip);
        },
        error: (err) => {
          this.toastr.error("Couldn't add trip. Please try again.");
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
