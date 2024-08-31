import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isExpanded = true;

  isFooterExpanded = false;

  username = "Hesham";

  userRole = 'Admin';

  constructor(private cdr : ChangeDetectorRef){}

  toggleExpanded() {
    this.isExpanded = ! this.isExpanded;
    if(! this.isExpanded) this.isFooterExpanded = false;
    this.cdr.detectChanges();
  }

  toogleFooterExpanded() {
    this.isExpanded = true;
    this.isFooterExpanded = ! this.isFooterExpanded;
    this.cdr.detectChanges();
  }

}
