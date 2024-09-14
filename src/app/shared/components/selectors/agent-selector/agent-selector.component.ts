import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Agent } from '../../../../pages/agents/models/agent.model';
import { AgentsService } from '../../../../pages/agents/services/agents.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-selector.component.html',
  styleUrl: './agent-selector.component.scss'
})
export class AgentSelectorComponent implements OnChanges, OnInit{
  searchQuery = "";

  agents : Agent[] = [];

  searchedAgents : Agent[] = []

  agentService = inject(AgentsService);

  toastr = inject(ToastrService);

  modalRef = inject(MatDialogRef<AgentSelectorComponent>)

  onSearch(searchQuery : string) {
    this.searchedAgents = this.agents.filter((val) => val.name.includes(searchQuery));
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.onSearch(changes['searchQuery'].currentValue);
  }

  ngOnInit(): void {
    this.agentService.fetchAgents().subscribe((agents) => {
      if(agents) {
        this.agents = agents;
        this.onSearch('');
      }
      else this.toastr.error('Unable to load agents')
    })
  }

  selectAgent(agent : Agent) {
    console.log('agent', JSON.stringify(agent))
    this.modalRef.close(agent);
  }
}
