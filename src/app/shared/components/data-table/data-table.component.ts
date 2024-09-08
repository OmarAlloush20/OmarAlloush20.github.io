import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainMenuScrollService } from '../../../pages/main-menu/services/main-menu-scroll.service';

type CellValueFunction = (header: string, value: any) => string | undefined;

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent implements OnInit {
  @ViewChild('popupActions') popupActions!: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2,
    private scrollService: MainMenuScrollService
  ) {}

  ngOnInit(): void {}

  positionPopup(event: MouseEvent): void {
    if (!this.selectedValue || !this.popupActions.nativeElement) return;

    const popupWidth = this.popupActions.nativeElement.offsetWidth || 103;
    const popupHeight = this.popupActions.nativeElement.offsetHeight || 31;

    const scrollY = this.scrollService.scrollPosition.y;
    const scrollX = this.scrollService.scrollPosition.x;

    let left = event.clientX - scrollX - popupWidth * 0.75;
    let top = event.clientY + scrollY - popupHeight * 0.75;

    // Adjust position if popup would go off-screen
    if (left + popupWidth > window.innerWidth) {
      left = event.clientX - scrollX - popupWidth * 2;
    }

    if (top + popupHeight > window.innerHeight) {
      top = event.clientY + scrollY - popupHeight;
    }

    this.renderer.setStyle(
      this.popupActions.nativeElement,
      'left',
      `${left}px`
    );
    this.renderer.setStyle(this.popupActions.nativeElement, 'top', `${top}px`);
    this.renderer.setStyle(this.popupActions.nativeElement, 'display', 'block');
  }

  @Input('headers') headers: string[] = [];

  @Input('data') data: any[] = [];

  @Input('cellValueFn') cellValueFn!: CellValueFunction;

  @Input('maxPages') maxPages: number = 1;

  @Input('onPageChanged') onPageChanged!: (value: number) => any;

  @Input('loading') loading: boolean = false;

  @Output('onAdd') onAdd: EventEmitter<any> = new EventEmitter<any>();

  @Output('onEdit') onEdit: EventEmitter<any> = new EventEmitter<any>();

  @Output('onDelete') onDelete: EventEmitter<any> = new EventEmitter<any>();

  @Output('onSearch') onSearch: EventEmitter<any> = new EventEmitter<any>();

  selectedValue?: any;

  searchQuery: string = '';

  currentPage: number = 1;

  setSelectedValue(event: MouseEvent, value?: any) {
    this.selectedValue = value;
    this.positionPopup(event);
  }

  add() {
    this.onAdd.emit();
  }

  edit(value?: any) {
    if (value) {
      this.onEdit.emit(value);
    }
  }

  delete(value?: any) {
    if (value) {
      this.onDelete.emit(value);
    }
  }

  search(query: string) {
    if (query) {
      this.onSearch.emit(query);
    }
  }

  onPageNumberChange(pageNumber: number) {
    if (pageNumber >= this.maxPages) {
      this.currentPage = this.maxPages;
    } else if (pageNumber <= 1) {
      this.currentPage = 1;
    } else {
      this.currentPage = pageNumber;
    }

    this.onPageChanged(this.currentPage);
  }
}
