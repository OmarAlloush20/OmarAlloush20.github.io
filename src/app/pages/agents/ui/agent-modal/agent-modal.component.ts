import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
  // Overrides

  override form: FormGroup;

  override get value() {
    return this.agent;
  }

  protected override modalRef = inject(MatDialogRef<AgentModalComponent>);

  // component

  @Input() agent?: Agent;

  @Input() title: string = 'Agent';

  constructor(fb: FormBuilder) {
    super();
    this.form = fb.group({
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
}
