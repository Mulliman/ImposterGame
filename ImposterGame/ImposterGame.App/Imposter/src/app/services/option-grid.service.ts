import { Injectable } from '@angular/core';

export class OptionGridGroup{
  constructor(title){
    this.title = title;
  }

  optionGrids: OptionGridModel[];
  title: string;
}

export class OptionGridModel{
  constructor(title){
    this.title = title;
  }

  options: string[];
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class OptionGridService {

  selectedOptionGrid: OptionGridModel;

  constructor() { }

  setSelectedOptionGrid(grid: OptionGridModel){
    this.selectedOptionGrid = grid;
  }

  async getAllOptionGrids(): Promise<OptionGridGroup[]>{

    var grid1 = new OptionGridModel("grid1");
    grid1.options = ["1", "2", "3", "4", "5", "6"];
    
    var grid2 = new OptionGridModel("grid2");
    grid2.options = ["a1", "a2", "a3", "a4", "a5", "a6"];

    var grid3 = new OptionGridModel("grid3");
    grid3.options = ["11", "22", "33", "44", "55", "66"];

    var grid4 = new OptionGridModel("grid4");
    grid4.options = ["11", "12", "13", "14", "15", "16"];

    var grid5 = new OptionGridModel("grid5");
    grid5.options = ["11", "22", "33", "44", "55", "66"];

    var group1 = new OptionGridGroup("Test 1");
    group1.optionGrids = [grid1, grid2, grid3];

    var group2 = new OptionGridGroup("Test 2");
    group2.optionGrids = [grid3, grid4];

    var group3 = new OptionGridGroup("Test 3");
    group3.optionGrids = [grid1, grid3, grid4, grid5];

    return [
      group1, group2, group3
    ];
  }
}
