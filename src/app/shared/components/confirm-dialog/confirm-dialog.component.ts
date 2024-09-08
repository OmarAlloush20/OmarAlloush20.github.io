import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() title? : string; 

  @Input() message? : string;

  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onConfirm() {
    this.dialogRef.close(true);
  }
}
