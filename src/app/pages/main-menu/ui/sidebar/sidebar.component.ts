import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isExpanded = false;

  isFooterExpanded = false;

  username = "Hesham";

  userRole = 'Admin';

  constructor(private cdr : ChangeDetectorRef, private authService : AuthService){}

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

  logout() {
    this.authService.invalidate();
  }

}
