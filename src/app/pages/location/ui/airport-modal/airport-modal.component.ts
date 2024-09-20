import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { Airport } from '../../models/location.model';

@Component({
  selector: 'app-airport-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './airport-modal.component.html',
  styleUrl: './airport-modal.component.scss',
})
export class AirportModalComponent extends FormComponent {
  // Overrides:
  override get value() {
    return this.airport
  }

  override form : FormGroup;

  protected override modalRef = inject(MatDialogRef<AirportModalComponent>);
  
  // Component

  @Input() title : string = 'Airport'

  @Input() airport? : Partial<Airport>;

  constructor(private fb : FormBuilder) {
    super();
    this.form = this.fb.group({
      name : ['', Validators.required],
      airportCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    })
  }

  ngOnInit(): void {
    if(this.airport) {
      this.form.patchValue({
        name: this.airport.name,
        airportCode: this.airport.airportCode
      })
    }
  }

}
