import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss'
})
export class FinancialsComponent {
  selectedPage : 'payment' | 'receipt' = 'payment';
}
