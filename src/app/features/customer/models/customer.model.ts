export type Customer = {
    _id? : any;
    firstname: string;
    middlename?: string;
    lastname: string;
    gender: "male" | "female";
    phone1: string;
    phone2?: string;
    email?: string;
}
  