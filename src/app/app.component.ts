import { Component, inject, isDevMode, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './shared/services/http/http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  http = inject(HttpService)

  ngOnInit(): void {
    if(isDevMode()) {
      this.http.post('user/createSeed', {}).subscribe(val => console.log(val));
      this.http.post('agent/seed-agents', {});
      this.http.post('customer/seed-customers', {});
    }
  }
  
  title = 'travel-flow';
}
