import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { Round } from 'src/app/services/game.service';
import { IPlayer, IRoundParticipant } from 'src/server';

@Pipe({
  name: 'notIncludingPlayer',
  pure: false
})
export class NotIncludingPlayerPipe implements PipeTransform {
  transform(items: IRoundParticipant[], filter: string): any {
      if (!items || !filter) {
          return items;
      }
      
      return items.filter(item => item.player.name != filter);
  }
}

@Component({
  selector: 'app-player-answer-list',
  templateUrl: './player-answer-list.component.html',
  styleUrls: ['./player-answer-list.component.scss']
})
export class PlayerAnswerListComponent implements OnInit {

  @Input() participants: IRoundParticipant[];
  @Input() selectedPlayerName: string;
  @Input() hideThisPlayerName: string;
  @Input() clickable: boolean;
  @Output() onPlayerSelected = new EventEmitter<IPlayer>();

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

