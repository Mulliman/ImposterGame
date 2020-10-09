import { Component, OnInit, Input } from '@angular/core';
import { IPlayerScore } from 'src/server';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {

  @Input() scores: IPlayerScore[];
  @Input() currentPlayer: string;

  constructor() { }

  ngOnInit() {
  }

}
