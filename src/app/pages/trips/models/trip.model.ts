import { Customer } from "../../customer/models/customer.model";

export interface Trip {
    _id? : any;
    tripType: "umrah" | "hajj" | "tourist" | "services";        
    startDate: Date;
    endDate: Date;
    totalAmount: number;
    customerTrip: Customer;
  }