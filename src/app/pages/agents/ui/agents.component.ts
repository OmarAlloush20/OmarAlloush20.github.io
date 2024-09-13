import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Agent } from '../models/agent.model';
import { AgentsService } from '../services/agents.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { AgentModalComponent } from './agent-modal/agent-modal.component';
import { DataTableSearchInfo } from '../../../shared/components/data-table/data-table.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent {
  tableHeaders: string[] = [
    'Agent Name',
    'Contact Person',
    'Contact Phone',
    'Email',
    'Agent Type',
    'Address',
  ];

  headerToValue = (header: string, agent: Agent): string | undefined => {
    switch (header) {
      case 'Agent Name':
        return agent.name;

      case 'Contact Person':
        return agent.contactPersonName;

      case 'Contact Phone':
        return agent.contactPhoneNumber;

      case 'Email':
        return agent.email;

      case 'Agent Type':
        return agent.agentType;

      case 'Address':
        return agent.address;
    }

    return undefined;
  };

  agents: Agent[] = [];
  private _query = '';
  private _allAgents: Agent[] = [];
  loading: boolean = false;

  private dialog = inject(MatDialog);
  private agentsService = inject(AgentsService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadAgents();
  }

  private _reloadAgents() {
    this.loading = true;
    const toastr = this.toastr;
    this.agentsService.fetchAgents().subscribe({
      next: (agents) => {
        if (agents === undefined) {
          toastr.error("Couldn't get agents. Please try again.", undefined, {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this._updateAgents(agents);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        toastr.warning("Couldn't get agents. Please try again.");
      },
    });
  }

  private _updateAgents(agents: Agent[], pageNumber: number = 1) {
    this._allAgents = agents;
    this.onSearchInfoChanged({
      query: this._query,
      pageNumber: pageNumber,
    });
  }

  openAddAgent() {
    const modalRef = this.dialog.open(AgentModalComponent);

    modalRef.afterClosed().subscribe((agent) => {
      if (agent) {
        this._addAgent(agent);
      }
    });
  }

  private _addAgent(agent: Agent) {
    this.loading = true;
    this.agentsService.addAgent(agent).subscribe({
      next: (val) => {
        if (val) {
          this.toastr.success('Agent added successfully.');
          this._reloadAgents();
        } else {
          this.toastr.error("Couldn't add agent. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add agent. Please try again.");
      },
    });
    this.loading = false;
  }

  async onSearchInfoChanged(info: DataTableSearchInfo) {
    this.loading = true;
    const { query, pageNumber } = info;
    this._query = query;
    const newAgents = this._allAgents.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.contactPersonName.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.agents = newAgents.splice(pageNumber * 10 - 10, pageNumber * 10);
    this.loading = false;
  }

  openEditAgent(agent: Agent) {
    const modalRef = this.dialog.open(AgentModalComponent);
    modalRef.componentInstance.agent = agent;

    const sub = modalRef.afterClosed().subscribe((editedAgent: Agent) => {
      if (editedAgent && this._isEditAllowed(editedAgent)) {
        this._editAgent(editedAgent);
        sub.unsubscribe();
      }
    });
  }

  private _isEditAllowed(editedAgent: Agent) {
    return true;
  }

  private _editAgent(agent: Agent) {
    this.loading = true;
    this.agentsService.editAgent(agent).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('Agent updated');
          this._reloadAgents();
        } else {
          this.toastr.warning("Couldn't update agent. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't update agent. Please try again.");
      },
    });
  }

  openDeleteAgent(agent: Agent) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
    modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteAgent(agent);
      }
    });
  }

  private _deleteAgent(agent: Agent) {
    this.loading = true;
    if (this._isDeleteAllowed(agent)) {
      this.agentsService.deleteAgent(agent).subscribe({
        next: (val) => {
          this.loading = false;
          if (val) {
            this.toastr.success('Agent deleted');
          } else {
            this.toastr.warning("Couldn't delete agent. Please try again.");
          }
          this._reloadAgents();
        },
        error: (_) => {
          this.loading = false;
          this.toastr.error("Couldn't delete agent. Please try again.");
        },
      });
    }
  }

  private _isDeleteAllowed(agent: Agent) {
    return true;
  }
}
