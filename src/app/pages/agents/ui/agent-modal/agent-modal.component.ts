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

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './agent-modal.component.html',
  styleUrl: './agent-modal.component.scss',
})
export class AgentModalComponent {
  @Input() agent?: Agent;

  @Input() title: string = 'Agent';

  agentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<AgentModalComponent>
  ) {
    this.agentForm = this.fb.group({
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
      this.agentForm.controls['name'].setValue(this.agent.name);
      this.agentForm.controls['agentType'].setValue(this.agent.agentType);
      this.agentForm.controls['contactPersonName'].setValue(
        this.agent.contactPersonName
      );
      this.agentForm.controls['contactPhoneNumber'].setValue(
        this.agent.contactPhoneNumber
      );
      this.agentForm.controls['email'].setValue(this.agent.email);
      this.agentForm.controls['address'].setValue(this.agent.address);
    }
  }

  onSubmit() {
    if (this.agentForm.valid) {
      const val = this.agentForm.value as Agent;
      this.dialog.close({ ...val, _id: this.agent?._id });
    }
  }

  cancel() {
    this.dialog.close();
  }
}
