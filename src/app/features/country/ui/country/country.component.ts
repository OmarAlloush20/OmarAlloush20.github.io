import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Country } from '../../models/country.model';
import { MatDialog } from '@angular/material/dialog';
import { CountryService } from '../../services/country.service';
import { SingleFieldModalComponent } from '../../../../shared/components/single-field-modal/single-field-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent implements OnInit {
  // Injections
  dialog = inject(MatDialog);

  countryService = inject(CountryService);

  toastr = inject(ToastrService);

  // I/O

  @Output() onCountryChanged = new EventEmitter<Country | undefined>;

  @Output() onCountriesFetched = new EventEmitter<Country[]>();

  // Instance variables

  loading: boolean = false;

  _selectedCountry? : Country;

  _countries: Country[] = [];

  ngOnInit(): void {
    this.onCountriesFetched.subscribe((countries) => (this._countries = countries));
    this.fetchCountries();
  }

  onSelectedCountryChanged() {
    this.onCountryChanged.emit()
  }

  fetchCountries() {
    this.countryService.fetchCountries().subscribe((countries) => {
      if (countries) {
        this.onCountriesFetched.emit(countries);
      }
    });
  }

  openAddCountry() {
    const modalRef = this.dialog.open(SingleFieldModalComponent);
    modalRef.componentInstance.title = 'Add Country';
    modalRef.componentInstance.fieldLabel = 'Country name';
    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._addCountry({ name: result });
      }
    });
  }

  private _addCountry(country: Country) {
    this.loading = true;
    this.countryService.addCountry(country).subscribe({
      next: (country) => {
        if (country) {
          this.toastr.success('Country added successfully.');
          this.fetchCountries();
        } else {
          this.toastr.error("Couldn't add country. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add country. Please try again.");
      },
    });
    this.loading = false;
    this.fetchCountries();
  }

  editCountry(country?: Country) {
    if (!country) return;

    const modalRef = this.dialog.open(SingleFieldModalComponent);
    modalRef.componentInstance.title = 'Edit Country';
    modalRef.componentInstance.fieldLabel = 'Country name';
    modalRef.componentInstance.value = country.name;

    const sub = modalRef.afterClosed().subscribe((result) => {
      if (result && result !== country.name) {
        this._editCountry(country, result);
      }
    });
  }

  private _editCountry(country: Country, newName: string) {
    this.loading = true;
    const updatedCountry: Country = { ...country, name: newName };
    this.countryService.updateCountry(updatedCountry).subscribe({
      next: (updatedCountry) => {
        if (updatedCountry) {
          this.toastr.success('Country updated successfully.');
          this.fetchCountries();
        } else {
          this.toastr.error("Couldn't update country. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't update country. Please try again.");
        this.loading = false;
      },
    });
  }

  deleteCountry(country?: Country) {
    if (!country) return;

    const confirmDelete = this.dialog.open(ConfirmDialogComponent);
    confirmDelete.afterClosed().subscribe((val) => {
      if (val) {
        this.countryService.deleteCountry(country).subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('Country deleted successfully.');
              this.fetchCountries();
            } else {
              this.toastr.error("Couldn't delete country. Please try again.");
            }
          },
          error: (err) => {
            this.toastr.error("Couldn't delete country. Please try again.");
          },
        });
      }
    });
  }
}
