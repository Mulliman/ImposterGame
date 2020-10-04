import { Injectable } from '@angular/core';
import { IPlayer, OptionGridsApiService, IGame, JoinGameModel, IOptionGridGroup } from 'src/server';


export class OptionGridGroup{
  constructor(title){
    this.name = title;
  }

  id: string;
  optionGrids: OptionGridModel[];
  name: string;
}

export class OptionGridModel{
  constructor(title){
    this.name = title;
  }

  id: string;
  options: string[];
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class OptionGridService {

  selectedOptionGrid: OptionGridModel;

  constructor(private optionGridsApi: OptionGridsApiService) {

 }

  setSelectedOptionGrid(grid: OptionGridModel){
    this.selectedOptionGrid = grid;
  }

  async getAllOptionGrids(): Promise<OptionGridGroup[]>{

    var gridData = await this.optionGridsApi.apiOptionGridsApiGetAllGridDataGet().toPromise();

    // var grid1 = new OptionGridModel("grid1");
    // grid1.options = ["1", "2", "TEST", "4", "5", "6", "HelloSam", "Hello Harry", "Three Words Here", "A long series of different words", "short", "shortword", "longerword", "Longishword", "Longerwordhere", "finalwordgoeshere"];
    
    // var grid2 = new OptionGridModel("grid2");
    // grid2.options = ["a1", "a2", "TEST", "a4", "a5", "a6", "HelloSam", "Hello Harry", "Three Words Here", "A long series of different words", "short", "shortword", "longerword", "Longishword", "Longerwordhere", "finalwordgoeshere"];

    // var grid3 = new OptionGridModel("grid3");
    // grid3.options = ["11", "22", "TEST", "44", "55", "66", "HelloSam", "Hello Harry", "Three Words Here", "A long series of different words", "short", "shortword", "longerword", "Longishword", "Longerwordhere", "finalwordgoeshere"];

    // var grid4 = new OptionGridModel("grid4");
    // grid4.options = ["11", "12", "TEST", "14", "15", "16", "HelloSam", "Hello Harry", "Three Words Here", "A long series of different words", "short", "shortword", "longerword", "Longishword", "Longerwordhere", "finalwordgoeshere"];

    // var grid5 = new OptionGridModel("grid5");
    // grid5.options = ["11", "22", "TEST", "44", "55", "66", "HelloSam", "Hello Harry", "Three Words Here", "A long series of different words", "short", "shortword", "longerword", "Longishword", "Longerwordhere", "finalwordgoeshere"];

    // var group1 = new OptionGridGroup("Test 1");
    // group1.optionGrids = [grid1, grid2, grid3];

    // var group2 = new OptionGridGroup("Test 2");
    // group2.optionGrids = [grid3, grid4];

    // var group3 = new OptionGridGroup("Test 3");
    // group3.optionGrids = [grid1, grid3, grid4, grid5];

    return gridData.allOptionGridGroups.map((item) => {
      return {
        id: item.id,
        name: item.name,
        optionGrids: item.optionGrids.map((og) => {
          return {
            id: og.id,
            name: og.name,
            options: og.options
          } as OptionGridModel;
        })
      } as OptionGridGroup;
    });
  }
}
