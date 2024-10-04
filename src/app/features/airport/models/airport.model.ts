import { City } from "../../city/models/city.model";

export interface Airport {
    _id? : any;
    name: string;
    airportCode: string;
    city: City;
  }