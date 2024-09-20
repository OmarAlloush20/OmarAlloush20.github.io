
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export abstract class FormComponent {
  abstract form: FormGroup;

  abstract get value(): any;

  protected abstract modalRef: MatDialogRef<any>;

  protected get appendedValues() : any{
    return {};
  }

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

  onSubmit() {
    if (this.value && this.form.valid) {
      this.modalRef.close({
        ...this.value,
        ...this.form.value,
        ...this.appendedValues
      });
    }
  }

  cancel() {
    this.modalRef.close();
  }
}
