import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiSelectComponent,
    },
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
  /// ControlValueAccessor implementation

  writeValue(obj: any[]): void {
    this.selectedOptions = obj;
  }

  private _onChange = (val?: any[]) => {};

  registerOnChange(onChange: any): void {
    this._onChange = onChange;
  }

  private _touched = false;

  markAsTouched() {
    if (!this._touched) {
      this._onTouched();
      this._touched = false;
    }
  }

  private _onTouched = () => {};

  registerOnTouched(onTouched: any): void {
    this._onTouched = onTouched;
  }

  private _disabled = false;

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  //// Component

  @Input() label: string = '';

  @Input() options: any[] = [];

  @Input() valueToString: (value: any) => string = (val) =>
    val.toString() ?? '';

  @Output() valuesChanged = new EventEmitter<any[]>();

  selectedOptions: any[] = [];

  get selectedOptionsDisplayValue() {
    return this.selectedOptions.map(option => this.valueToString(option)).join('; ')
  }

  onOptionClick(option: any) {
    this.markAsTouched();

    if (!this._disabled) {
      this.toggleOption(option);
      this.valuesChanged.emit(this.selectedOptions.map((val) => val.value));
      this._onChange(this.selectedOptions);
    }
  }

  toggleOption(option: any) {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option);
    }
  }
}
