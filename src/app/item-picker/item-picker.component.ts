import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventType } from '../model/event';

@Component({
  selector: 'app-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrl: './item-picker.component.css'
})
export class ItemPickerComponent {

  @Input() items: any[] = [];
  @Output() selectedItemEvent = new EventEmitter<any>();
  @Input() selectedItem?: any;

  constructor() {
  }

  onChange(item: any) {
    console.log(item);
    this.selectedItemEvent.emit(item);
  }

}
