import { FormGroup } from "@angular/forms";

export abstract class FormComponent {
  abstract form: FormGroup;
  
  shouldDisplayErrorMessage(controlName: string, errorName: string): boolean {
    return (
      this.form.controls[controlName].hasError(errorName) &&
      this.form.controls[controlName].touched
    );
  }

  shouldDisplayErrorContainer(controlName: string): boolean {
    return (
      this.form.controls[controlName].invalid &&
      this.form.controls[controlName].touched
    );
  }
}