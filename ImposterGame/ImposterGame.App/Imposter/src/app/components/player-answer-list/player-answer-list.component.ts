import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerModel } from 'src/app/services/player.service';
import { Round } from 'src/app/services/game.service';

@Component({
  selector: 'app-player-answer-list',
  templateUrl: './player-answer-list.component.html',
  styleUrls: ['./player-answer-list.component.scss'],
})
export class PlayerAnswerListComponent implements OnInit {

  @Input() participants: any[];
  @Input() clickable: boolean;
  @Output() onPlayerSelected = new EventEmitter<PlayerModel>();

  selectedPlayerName: string;

  constructor() { }

  ngOnInit() {
  }

  selectImposter(participant: any){
    if(this.clickable){
      this.selectedPlayerName = participant.player.name;
      this.onPlayerSelected.emit(participant.player);
    }
  }
}