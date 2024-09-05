import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CellValueFunction = (header : string, value : any) => string | undefined;

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input("headers") headers : string[] = [];

  @Input("data") data : any[] = [];

  @Input("cellValueFn") cellValueFn! : CellValueFunction;

  @Input("onAdd") onAdd! : (value : any) => any;

  @Input("onEdit") onEdit! : (value : any) => any;

  @Input("onDelete") onDelete! : (value : any) => any;

  @Input("onSearch") onSearch! : (value : any) => any;

  selectedValue? : any;

  searchQuery : string = '';

  setSelectedValue(value? : any) {
    this.selectedValue = value;
  }

  add(value? : any) {
    if(value) {
      this.onAdd(value);
    }
  }
  
  edit(value? : any) {
    if(value) {
      this.onEdit(value);
      
    }
  }

  delete(value? : any) {
    if(value) {
      this.onDelete(value);
    }
  }

  search(query : string) {
    if(query) {
      this.onSearch(query);
    }
  }

}
