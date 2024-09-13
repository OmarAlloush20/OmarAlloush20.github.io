import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Agent } from '../../models/agent.model';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './agent-modal.component.html',
  styleUrl: './agent-modal.component.scss',
})
export class AgentModalComponent extends FormComponent {
  @Input() agent?: Agent;

  @Input() title: string = 'Agent';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<AgentModalComponent>
  ) {
    super();
    this.form = this.fb.group({
      name: [this.agent?.name ?? '', Validators.required],
      agentType: [this.agent?.agentType ?? '', Validators.required],
      contactPersonName: [
        this.agent?.contactPersonName ?? '',
        Validators.required,
      ],
      contactPhoneNumber: [
        this.agent?.contactPhoneNumber ?? '',
        Validators.required,
      ],
      email: [this.agent?.email ?? '', Validators.required],
      address: [this.agent?.address ?? '', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.agent) {
      this.form.controls['name'].setValue(this.agent.name);
      this.form.controls['agentType'].setValue(this.agent.agentType);
      this.form.controls['contactPersonName'].setValue(
        this.agent.contactPersonName
      );
      this.form.controls['contactPhoneNumber'].setValue(
        this.agent.contactPhoneNumber
      );
      this.form.controls['email'].setValue(this.agent.email);
      this.form.controls['address'].setValue(this.agent.address);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value as Agent;
      this.dialog.close({ ...val, _id: this.agent?._id });
    }
  }

  cancel() {
    this.dialog.close();
  }
}
