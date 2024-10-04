import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { capitalizeFirstLetter } from '../../../../core/utils/string.utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isExpanded = false;

  isFooterExpanded = false;

  username = "Username";

  userRole = 'Role';

  constructor(private cdr : ChangeDetectorRef, private authService : AuthService){}

  ngOnInit(): void {
    const sessionUser =  this.authService.user;
    if (sessionUser) {
      this.username = sessionUser.username;
      this.userRole = capitalizeFirstLetter(sessionUser.userType);
    }

  }

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
