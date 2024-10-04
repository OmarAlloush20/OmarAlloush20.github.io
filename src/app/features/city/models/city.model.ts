import { Country } from "../../country/models/country.model";

export interface City {
    _id? : any;
    name: string;
    country?: Country;
    gmtOffset: number;
}

