import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Round } from 'src/app/services/game.service';
import { IPlayer, IRoundParticipant } from 'src/server';

@Component({
  selector: 'app-player-answer-list',
  templateUrl: './player-answer-list.component.html',
  styleUrls: ['./player-answer-list.component.scss'],
})
export class PlayerAnswerListComponent implements OnInit {

  @Input() participants: IRoundParticipant[];
  @Input() clickable: boolean;
  @Output() onPlayerSelected = new EventEmitter<IPlayer>();

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