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
  allOptionGridGroups: OptionGridGroup[];

  constructor(private optionGridsApi: OptionGridsApiService) {

 }

  setSelectedOptionGrid(grid: OptionGridModel){
    this.selectedOptionGrid = grid;
  }

  async getAllOptionGrids(): Promise<OptionGridGroup[]>{

    if(this.allOptionGridGroups){
      return this.allOptionGridGroups;
    }

    var gridData = await this.optionGridsApi.apiOptionGridsApiGetAllGridDataGet().toPromise();

    var mappedGridData = gridData.allOptionGridGroups.map((item) => {
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

    this.allOptionGridGroups = mappedGridData;

    return mappedGridData;
  }
}
