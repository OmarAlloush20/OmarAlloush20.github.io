import { Customer } from "../../customer/models/customer.model";

export interface ReceiptVoucher {
    _id? : any;
    totalAmount: number;
    amountPaid: number; 
    remainingAmount: number;
    paymentMethod: "cash" | "cheque" | "transfer";
    bankName?: string;
    chequeDueDate?: Date;
    description : string;
    customer: Customer;  
  }