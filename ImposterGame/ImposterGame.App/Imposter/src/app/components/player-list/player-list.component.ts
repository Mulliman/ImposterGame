import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IPlayer } from 'src/server';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() currentPlayer: IPlayer;
  @Input() players: IPlayer[];

  constructor() { }

  ngOnInit() {
    console.log('app-player-list', this.players, this.currentPlayer);
  }

  selectImposter(participant: any){
      
  }
}