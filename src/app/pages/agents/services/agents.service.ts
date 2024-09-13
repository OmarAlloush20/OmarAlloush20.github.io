import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Agent } from '../models/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private _endpoint = 'agent';

  constructor(private http: HttpService) {}

  fetchAgents(query?: string): Observable<Agent[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Agent[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addAgent(agent: Agent): Observable<Agent | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.post(endpoint, agent).pipe(
      map((val) => (val.body as any).data as Agent),
      catchError((_) => of(undefined))
    );
  }

  editAgent(updatedAgent: Agent): Observable<Agent | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.update(endpoint, updatedAgent).pipe(
      map((val) => (val.body as any).data as Agent),
      catchError((_) => of(undefined))
    );
  }

  deleteAgent(agent: Agent): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: agent._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= HttpStatusCode.Ok && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
