import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Airport, City, Country } from '../models/location.model';
import { MatDialog } from '@angular/material/dialog';
import { SingleFieldModalComponent } from '../../../shared/components/single-field-modal/single-field-modal.component';
import { CountryService } from '../services/country.service';
import { CityService } from '../services/city.service';
import { AirportService } from '../services/airport.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityModalComponent } from './city-modal/city-modal.component';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  countries: Country[] = [{ name: 'UAE' }, { name: 'Syria' }, { name: 'Oman' }];

  selectedCountry?: Country = undefined;

  countryService = inject(CountryService);

  cities: City[] = [];

  selectedCity?: City = undefined;

  cityService = inject(CityService);

  airports: Airport[] = [];

  selectedAirport?: Airport = undefined;

  airportService = inject(AirportService);

  loading = false;

  //// Component

  dialog = inject(MatDialog);

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries() {
    this.countryService.fetchCountries().subscribe((countries) => {
      if (countries) {
        this.cities = [];
        this.airports = [];
        this.countries = countries;
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

  onCountryChanged() {
    console.log(this.selectedCountry?.name);
    this.fetchCities();
  }

  onCityChanged() {
    this.fetchAirports();
  }

  fetchCities() {
    if (!this.selectedCountry) return;

    this.cityService
      .fetchCities(this.selectedCountry._id)
      .subscribe((cities) => {
        if (cities) {
          this.airports = [];
          this.cities = cities;
        }
      });
  }

  openAddCity() {
    if (!this.selectedCountry) return;

    const modalRef = this.dialog.open(CityModalComponent);
    modalRef.componentInstance.title = 'Add City';
    modalRef.componentInstance.city = { country: this.selectedCountry };

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._addCity(result);
      }
    });
  }

  private _addCity(city: City) {
    this.loading = true;
    this.cityService.addCity(city).subscribe({
      next: (city) => {
        if (city) {
          this.toastr.success('City added successfully.');
          this.fetchCities();
        } else {
          this.toastr.error("Couldn't add city. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add city. Please try again.");
      },
    });
    this.loading = false;
    this.fetchCities();
  }

  editCity(city?: City) {
    if (!city || !this.selectedCountry) return;

    const modalRef = this.dialog.open(CityModalComponent);
    modalRef.componentInstance.title = 'Add City';
    modalRef.componentInstance.city = this.selectedCity;

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._editCity(result);
      }
    });
  }

  private _editCity(city: City) {
    this.loading = true;
    this.cityService.updateCity(city).subscribe({
      next: (updatedCity) => {
        if (updatedCity) {
          this.toastr.success('City updated successfully.');
          this.fetchCities();
        } else {
          this.toastr.error("Couldn't update city. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't update city. Please try again.");
        this.loading = false;
      },
    });
  }

  deleteCity(city?: City) {
    if (!city || !this.selectedCountry) return;

    const confirmDelete = this.dialog.open(ConfirmDialogComponent);
    confirmDelete.afterClosed().subscribe((val) => {
      if (val) {
        this.cityService.deleteCity(city).subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('City deleted successfully.');
              this.fetchCities();
            } else {
              this.toastr.error("Couldn't delete city. Please try again.");
            }
          },
          error: (err) => {
            this.toastr.error("Couldn't delete city. Please try again.");
          },
        });
      }
    });
  }

  fetchAirports() {
    if (!this.selectedCity) return;

    this.airportService
      .fetchAirports(this.selectedCity._id)
      .subscribe((airports) => {
        if (airports) {
          this.airports = airports;
        }
      });
  }

  openAddAirport() {
    if (!this.selectedCity) return;

    const modalRef = this.dialog.open(SingleFieldModalComponent);
    modalRef.componentInstance.title = 'Add Airport';
    modalRef.componentInstance.fieldLabel = 'Airport name';

    const sub = modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._addAirport(result);
      }
    });
  }

  private _addAirport(airportName: string) {
    this.loading = true;
    const airport: Airport = {
      name: airportName,
      city: this.selectedCity?._id,
      airportCode: '',
    };
    this.airportService.addAirport(airport).subscribe({
      next: (airport) => {
        if (airport) {
          this.toastr.success('Airport added successfully.');
          this.fetchAirports();
        } else {
          this.toastr.error("Couldn't add airport. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add airport. Please try again.");
      },
    });
    this.loading = false;
    this.fetchAirports();
  }

  editAirport(airport?: Airport) {
    if (!airport || !this.selectedCity) return;

    const modalRef = this.dialog.open(SingleFieldModalComponent);
    modalRef.componentInstance.title = 'Edit Airport';
    modalRef.componentInstance.fieldLabel = 'Airport name';
    modalRef.componentInstance.value = airport.name;

    const sub = modalRef.afterClosed().subscribe((result) => {
      if (result && result !== airport.name) {
        this._editAirport(airport, result);
      }
    });
  }

  private _editAirport(airport: Airport, newName: string) {
    this.loading = true;
    const updatedAirport: Airport = { ...airport, name: newName };
    this.airportService.updateAirport(updatedAirport).subscribe({
      next: (updatedAirport) => {
        if (updatedAirport) {
          this.toastr.success('Airport updated successfully.');
          this.fetchAirports();
        } else {
          this.toastr.error("Couldn't update airport. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't update airport. Please try again.");
        this.loading = false;
      },
    });
  }

  deleteAirport(airport?: Airport) {
    if (!airport || !this.selectedCity) return;

    const confirmDelete = this.dialog.open(ConfirmDialogComponent);
    confirmDelete.afterClosed().subscribe((val) => {
      if (val) {
        this.airportService.deleteAirport(airport).subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('Airport deleted successfully.');
              this.fetchAirports();
            } else {
              this.toastr.error("Couldn't delete airport. Please try again.");
            }
          },
          error: (err) => {
            this.toastr.error("Couldn't delete airport. Please try again.");
          },
        });
      }
    });
  }
}
