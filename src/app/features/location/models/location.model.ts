export interface Country {
    _id?: any;
    name: string;
}

export interface City {
    _id? : any;
    name: string;
    country?: Country;
    gmtOffset: number;
}

export interface Airport {
    _id? : any;
    name: string;
    airportCode: string;
    city: City;
  }