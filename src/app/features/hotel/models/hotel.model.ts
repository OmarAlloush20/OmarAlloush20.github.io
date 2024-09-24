import { City } from "../../city/models/city.model";

export interface Hotel {
    _id? : any;
    name: string;
    city: City;
    rating: number;
    phone: string;
    contacPersonName: string;
    email: string;
  }