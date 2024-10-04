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
  ngOnInit(): void {
  }
  
  title = 'travel-flow';
}
