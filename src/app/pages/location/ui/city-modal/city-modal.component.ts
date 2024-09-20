import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { City } from '../../models/location.model';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-city-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './city-modal.component.html',
  styleUrl: './city-modal.component.scss'
})
export class CityModalComponent extends FormComponent implements OnInit {
  // Overrides:
  override get value() {
    return this.city
  }

  override form : FormGroup;

  protected override modalRef = inject(MatDialogRef<CityModalComponent>);
  
  // Component

  @Input() title : string = 'City'

  @Input() city? : Partial<City>;

  constructor(private fb : FormBuilder) {
    super();
    this.form = this.fb.group({
      name : ['', Validators.required],
      gmtOffset: [0, Validators.required],
    })
  }

  ngOnInit(): void {
    if(this.city) {
      this.form.patchValue({
        name: this.city.name,
        gmtOffset: this.city.gmtOffset
      })
    }
  }
}
