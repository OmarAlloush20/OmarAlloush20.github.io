import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerSelectorComponent } from '../../../shared/components/selectors/customer-selector/customer-selector.component';
import { Customer } from '../../customer/models/customer.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { Trip } from '../models/trip.model';
import { ToastrService } from 'ngx-toastr';
import { TripModalComponent } from '../../trip/ui/trip-modal/trip-modal.component';
import { TripService } from '../../trip/services/trip.service';
import { DataTableSearchInfo } from '../../../shared/components/data-table/data-table.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
})
export class TripsComponent {
  dialog = inject(MatDialog);

  customer?: Customer;

  startDate?: Date;

  endDate?: Date;

  type?: 'umrah' | 'hajj' | 'tourist';

  trips: Trip[] = [];

  selectCustomer() {
    const ref = this.dialog.open(CustomerSelectorComponent);
    ref.afterClosed().subscribe((val) => {
      this.customer = val;
    });
  }

  applyFilter() {
    this.trips = this.filterTrips(this._allTrips, {
      customer: this.customer,
      endDate: this.endDate,
      startDate: this.startDate,
    });
  }

  filterTrips(trips: Trip[], criteria: FilterCriteria): Trip[] {
    return trips.filter((trip) => {
      const matchesCustomer =
        !criteria.customer ||
        trip.customerTrip._id === criteria.customer._id ||
        trip.customerTrip.firstname === criteria.customer.firstname;

      const matchesStartDate =
        !criteria.startDate || trip.startDate >= criteria.startDate;

      const matchesEndDate =
        !criteria.endDate || trip.endDate <= criteria.endDate;

      return matchesCustomer && matchesStartDate && matchesEndDate;
    });
  }

  tableHeaders: string[] = [
    'Customer Name',
    'Trip Type',
    'Start Date',
    'End Date',
    'Total Amount',
  ];

  headerToValue = (header: string, trip: Trip): string => {
    switch (header) {
      case 'Customer Name':
        return `${trip.customerTrip.firstname} ${trip.customerTrip.lastname}`;

      case 'Trip Type':
        return trip.tripType;

      case 'Start Date':
        return new Date(trip.startDate).toLocaleDateString();

      case 'End Date':
        return new Date(trip.endDate).toLocaleDateString();

      case 'Total Amount':
        return trip.totalAmount.toString();
    }

    return '';
  };

  private _query = '';

  private _allTrips: Trip[] = [];

  loading: boolean = false;

  private tripsService = inject(TripService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadTrips();
  }

  private _reloadTrips() {
    this.loading = true;
    const toastr = this.toastr;
    this.tripsService.fetchTrips().subscribe({
      next: (trips) => {
        if (trips === undefined) {
          toastr.error("Couldn't get trips. Please try again.", undefined, {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this._updateTrips(trips);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        toastr.warning("Couldn't get trips. Please try again.");
      },
    });
  }

  private _updateTrips(trips: Trip[], pageNumber: number = 1) {
    this._allTrips = trips;
    this.onSearchInfoChanged({
      query: this._query,
      pageNumber: pageNumber,
    });
  }

  openAddTrip() {
    const modalRef = this.dialog.open(TripModalComponent);

    modalRef.afterClosed().subscribe((trip) => {
      if (trip) {
        this._addTrip(trip);
      }
    });
  }

  private _addTrip(trip: Trip) {
    this.loading = true;
    this.tripsService.addTrip(trip).subscribe({
      next: (val) => {
        if (val) {
          this.toastr.success('Trip added successfully.');
          this._reloadTrips();
        } else {
          this.toastr.error("Couldn't add trip. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add trip. Please try again.");
      },
    });
    this.loading = false;
  }

  async onSearchInfoChanged(info: DataTableSearchInfo) {
    this.loading = true;
    const { query, pageNumber } = info;
    this._query = query;
    const newTrips = this._allTrips.filter((trip) => {
      return (
        trip.customerTrip.firstname
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        trip.customerTrip.lastname
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        trip.tripType.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.trips = newTrips.splice(pageNumber * 10 - 10, pageNumber * 10);
    this.loading = false;
  }

  openEditTrip(trip: Trip) {
    const modalRef = this.dialog.open(TripModalComponent);
    modalRef.componentInstance.trip = trip;

    const sub = modalRef.afterClosed().subscribe((editedTrip: Trip) => {
      if (editedTrip && this._isEditAllowed(editedTrip)) {
        this._editTrip(editedTrip);
        sub.unsubscribe();
      }
    });
  }

  private _isEditAllowed(editedTrip: Trip) {
    return true;
  }

  private _editTrip(trip: Trip) {
    this.loading = true;
    this.tripsService.updateTrip(trip).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('Trip updated');
          this._reloadTrips();
        } else {
          this.toastr.warning("Couldn't update trip. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't update trip. Please try again.");
      },
    });
  }

  openDeleteTrip(trip: Trip) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
    modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteTrip(trip);
      }
    });
  }

  private _deleteTrip(trip: Trip) {
    this.loading = true;
    if (this._isDeleteAllowed(trip)) {
      this.tripsService.deleteTrip(trip).subscribe({
        next: (val) => {
          this.loading = false;
          if (val) {
            this.toastr.success('Trip deleted');
          } else {
            this.toastr.warning("Couldn't delete trip. Please try again.");
          }
          this._reloadTrips();
        },
        error: (_) => {
          this.loading = false;
          this.toastr.error("Couldn't delete trip. Please try again.");
        },
      });
    }
  }

  private _isDeleteAllowed(trip: Trip) {
    return true;
  }
}

interface FilterCriteria {
  customer?: Customer;
  startDate?: Date;
  endDate?: Date;
}
