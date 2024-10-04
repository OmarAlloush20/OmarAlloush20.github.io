import { Agent } from "../../agents/models/agent.model";

export interface PaymentVoucher {
    _id? : any;
    agent: Agent;
    date: Date;
    paymentMethod: "cash" | "cheque" | "bankTransfer";
    description: string;
    bankName: string;
    chequeDueDate: Date;
    amount: number;
  }
  