import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AirportService } from '../../services/airport.service';
import { ToastrService } from 'ngx-toastr';
import { Airport } from '../../models/airport.model';
import { City } from '../../../city/models/city.model';
import { AirportModalComponent } from '../airport-modal/airport-modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-airport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './airport.component.html',
  styleUrl: './airport.component.scss',
})
export class AirportComponent {
  // Injectables

  dialog = inject(MatDialog);

  airportService = inject(AirportService);

  toastr = inject(ToastrService);

  // I/O

  @Output() onAirportChanged = new EventEmitter<Airport | undefined>();

  @Output() onAirportsFetched = new EventEmitter<Airport[]>();

  @Input() set city(city: City | undefined) {
    this._city = city;
    this.fetchAirports();
  }

  // Instance variables

  private _city?: City;

  _selectedAirport?: Airport;

  _loadedAirports: Airport[] = [];

  loading: boolean = false;

  ngOnInit(): void {
    this.onAirportChanged.subscribe((airport) => {
      this._selectedAirport = airport;
    });
    this.onAirportsFetched.subscribe((airports) => {
      this._loadedAirports = airports;
      this.onAirportChanged.emit(undefined);
    });
    this.fetchAirports();
  }

  onSelectedAirportChanged() {
    this.onAirportChanged.emit(this._selectedAirport);
  }

  fetchAirports() {
    if (!this._city) return this.onAirportsFetched.emit([]);

    this.airportService.fetchAirports(this._city).subscribe((airports) => {
      if (airports) {
        this.onAirportsFetched.emit(airports);
      }
    });
  }

  openAddAirport() {
    if (!this._city) return;

    const modalRef = this.dialog.open(AirportModalComponent);
    modalRef.componentInstance.title = 'Add Airport';
    modalRef.componentInstance.airport = { city: this._city };

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._addAirport(result);
      }
    });
  }

  private _addAirport(airport: Airport) {
    this.loading = true;
    this.airportService.addAirport(airport).subscribe({
      next: (airport) => {
        if (airport) {
          this.toastr.success('Airport added successfully.');
          this.fetchAirports();
        } else {
          this.toastr.error("Couldn't add airport. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't add airport. Please try again.");
        this.loading = false;
      },
    });
  }

  editAirport(airport?: Airport) {
    if (!airport || !this._city) return;

    const modalRef = this.dialog.open(AirportModalComponent);
    modalRef.componentInstance.title = 'Edit Airport';
    modalRef.componentInstance.airport = this._selectedAirport;

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._editAirport(result);
      }
    });
  }

  private _editAirport(airport: Airport) {
    this.loading = true;
    this.airportService.updateAirport(airport).subscribe({
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
    if (!airport || !this._city) return;

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
            this.loading = false;
          },
          error: (err) => {
            this.toastr.error("Couldn't delete airport. Please try again.");
            this.loading = false;
          },
        });
      }
    });
  }
}
