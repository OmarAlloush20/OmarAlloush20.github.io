import { Validators } from "@angular/forms";

export const phoneNumberValidator = Validators.pattern("^[+]*[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$");