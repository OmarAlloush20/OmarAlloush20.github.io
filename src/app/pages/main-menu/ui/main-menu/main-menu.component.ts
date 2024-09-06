import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { MainMenuScrollService } from '../../services/main-menu-scroll.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  constructor(private scrollService: MainMenuScrollService) {}

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollService.setScrollPosition({
      x: target.scrollLeft,
      y: target.scrollTop,
    });
  }
}
