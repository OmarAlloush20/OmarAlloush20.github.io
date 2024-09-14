import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-single-field-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-field-modal.component.html',
  styleUrl: './single-field-modal.component.scss'
})
export class SingleFieldModalComponent {
  @Input() value : string = '';

  @Input() title : string = '';

  @Input() fieldLabel : string = '';

  modalRef = inject(MatDialogRef<SingleFieldModalComponent>)

  onSubmit() {
    this.modalRef.close(this.value);
  }

  cancel() {
    this.modalRef.close();
  }
}
