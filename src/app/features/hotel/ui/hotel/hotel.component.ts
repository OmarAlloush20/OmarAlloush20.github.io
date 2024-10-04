import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotelService } from '../../../hotel/services/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { Hotel } from '../../models/hotel.model';
import { City } from '../../../city/models/city.model';
import { HotelModalComponent } from '../hotel-modal/hotel-modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class HotelComponent {
  // Injectables

  dialog = inject(MatDialog);

  hotelService = inject(HotelService);

  toastr = inject(ToastrService);

  // I/O

  @Output() onHotelChanged = new EventEmitter<Hotel | undefined>();

  @Output() onHotelsFetched = new EventEmitter<Hotel[]>();

  @Input() set city(city: City | undefined) {
    this._city = city;
    this.fetchHotels();
  }

  // Instance variables

  private _city?: City;

  get city() {
    return this._city;
  }

  _selectedHotel?: Hotel;

  _loadedHotels: Hotel[] = [];

  loading: boolean = false;

  ngOnInit(): void {
    this.onHotelChanged.subscribe((hotel) => {
      this._selectedHotel = hotel;
    });
    this.onHotelsFetched.subscribe((hotels) => {
      this._loadedHotels = hotels;
      this.onHotelChanged.emit(undefined);
    });
    this.fetchHotels();
  }

  onSelectedHotelChanged() {
    this.onHotelChanged.emit(this._selectedHotel);
  }

  fetchHotels() {
    if (!this._city) return this.onHotelsFetched.emit([]);

    this.loading = true;

    this.hotelService.fetchHotels(this._city).subscribe({
      next: (hotels) => {
        if (hotels) {
          this.onHotelsFetched.emit(hotels);
        }
        this.loading = false;
      },
      error: (_) => {
        this.toastr.error("Could not get hotels. Please try again.")
      }
    });
  }

  openAddHotel() {
    if (!this._city) return;

    const modalRef = this.dialog.open(HotelModalComponent);
    modalRef.componentInstance.title = 'Add Hotel';
    modalRef.componentInstance.hotel = { city: this._city };

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._addHotel(result);
      }
    });
  }

  private _addHotel(hotel: Hotel) {
    this.loading = true;
    this.hotelService.addHotel(hotel).subscribe({
      next: (hotel) => {
        if (hotel) {
          this.toastr.success('Hotel added successfully.');
          this.fetchHotels();
        } else {
          this.toastr.error("Couldn't add hotel. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't add hotel. Please try again.");
        this.loading = false;
      },
    });
  }

  editHotel(hotel?: Hotel) {
    if (!hotel || !this._city) return;

    const modalRef = this.dialog.open(HotelModalComponent);
    modalRef.componentInstance.title = 'Edit Hotel';
    modalRef.componentInstance.hotel = this._selectedHotel;

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this._editHotel(result);
      }
    });
  }

  private _editHotel(hotel: Hotel) {
    this.loading = true;
    this.hotelService.updateHotel(hotel).subscribe({
      next: (updatedHotel) => {
        if (updatedHotel) {
          this.toastr.success('Hotel updated successfully.');
          this.fetchHotels();
        } else {
          this.toastr.error("Couldn't update hotel. Please try again.");
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error("Couldn't update hotel. Please try again.");
        this.loading = false;
      },
    });
  }

  deleteHotel(hotel?: Hotel) {
    if (!hotel || !this._city) return;

    const confirmDelete = this.dialog.open(ConfirmDialogComponent);
    confirmDelete.afterClosed().subscribe((val) => {
      if (val) {
        this.hotelService.deleteHotel(hotel).subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('Hotel deleted successfully.');
              this.fetchHotels();
            } else {
              this.toastr.error("Couldn't delete hotel. Please try again.");
            }
            this.loading = false;
          },
          error: (err) => {
            this.toastr.error("Couldn't delete hotel. Please try again.");
            this.loading = false;
          },
        });
      }
    });
  }

}
