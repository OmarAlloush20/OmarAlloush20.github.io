import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryComponent } from "../../country/ui/country/country.component";
import { CityComponent } from "../../city/ui/city/city.component";
import { Country } from '../../country/models/country.model';
import { City } from '../../city/models/city.model';
import { Airport } from '../../airport/models/airport.model';
import { AirportComponent } from "../../airport/ui/airport/airport.component";

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, CountryComponent, CityComponent, AirportComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent {
  

  selectedCountry? : Country;

  selectedCity? : City;

  selectedAirport? : Airport;

  onCountriesFetched(countries? : Country[]) {
    this.selectedCountry = undefined;
    this.selectedCity = undefined;
    this.selectedAirport = undefined;
  }

  onCountryChanged(country? : Country) {
    this.selectedCountry = country;
  }

  onCitiesFetched(cities? : City[]) {
    this.selectedCity = undefined;
    this.selectedAirport = undefined;
  }

  onCityChanged(city? : City) {
    this.selectedCity = city;
  }

  onAirportsFetched(airports : Airport[]) {
    this.selectedAirport = undefined;
  }

  onAirportChanged(airport? : Airport) {
    this.selectedAirport = airport;
  }
}
