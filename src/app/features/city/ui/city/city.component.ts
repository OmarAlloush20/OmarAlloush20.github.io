import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { City } from '../../models/city.model';
import { MatDialog } from '@angular/material/dialog';
import { CityService } from '../../services/city.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country } from '../../../country/models/country.model';
import { CityModalComponent } from '../city-modal/city-modal.component';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss',
})
export class CityComponent implements OnInit {

  // Injectables

  dialog = inject(MatDialog);

  cityService = inject(CityService);

  toastr = inject(ToastrService);

  // I/O

  @Output() onCityChanged = new EventEmitter<City | undefined>();

  @Output() onCitiesFetched = new EventEmitter<City[]>();

  @Input() set country(country: Country | undefined) {
    this._country = country;
    country ? this.fetchCities() : this.onCitiesFetched.emit([]);
  }

  // Instance variables

  private _country?: Country;

  _selectedCity?: City;

  _loadedCities: City[] = [];

  loading: boolean = false;

  ngOnInit(): void {
    this.onCitiesFetched.subscribe((cities) => (this._loadedCities = cities));
    this.fetchCities();
  }

  onSelectedCityChanged() {
    this.onCityChanged.emit(this._selectedCity);
  }

  fetchCities() {
    if (this._country) {
      this.cityService.fetchCities(this._country).subscribe((cities) => {
        if (cities) {
          this.onCitiesFetched.emit(cities);
        }
      });
    }
  }

  openAddCity() {
    if (this._country) {
      const modalRef = this.dialog.open(CityModalComponent);
      modalRef.componentInstance.title = 'Add City';
      modalRef.componentInstance.city = { country: this._country };

      modalRef.afterClosed().subscribe((result) => {
        if (result) {
          this._addCity(result);
        }
      });
    }
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
    if (!city || !this._country) return;

    const modalRef = this.dialog.open(CityModalComponent);
    modalRef.componentInstance.title = 'Edit City';
    modalRef.componentInstance.city = this._selectedCity;

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
    if (!city || !this._country) return;

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
}
