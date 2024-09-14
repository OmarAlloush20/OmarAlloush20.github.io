export interface Country {
    _id?: any;
    name: string;
}

export interface City {
    _id? : any;
    name: string;
    country: string;
    // gmtOffset: number;
}

export interface Airport {
    _id? : any;
    name: string;
    // airportCode: string;
    city: string;
  }