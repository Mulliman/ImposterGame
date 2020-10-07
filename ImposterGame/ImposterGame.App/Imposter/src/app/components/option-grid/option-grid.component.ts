import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { chunkArray } from 'src/app/Utils/ArrayUtils';

@Component({
  selector: 'app-option-grid',
  templateUrl: './option-grid.component.html',
  styleUrls: ['./option-grid.component.scss'],
})
export class OptionGridComponent implements OnInit {

  readonly columns = 2;
  isLoaded: boolean;
  rows: string[][];

  @Input() options: string[];
  @Input() selectedOption: string;
  @Input() showButtons: string;

  @Output() onAnswerSelected = new EventEmitter<string>();
  
  constructor() { }

  async ngOnInit() {    
    this.rows = chunkArray(this.options, this.columns);

    this.isLoaded = true;
  }

  chooseOption(option: string){
    this.onAnswerSelected.emit(option);
  }
} 