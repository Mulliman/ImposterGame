import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseGameComponent } from '../BaseGameComponent';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { ModalController } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy  {
  

  timer: number = 1;
  timerInterval;

  constructor(){
  }

  ngOnInit() {
    console.log("TimerComponent enter");
    this.timerInterval = setInterval(() => this.timer++, 1000);
  }

  ngOnDestroy(): void {
    console.log("TimerComponent leave");
    clearInterval(this.timerInterval);
  }

  getDisplayTime() {
    var minutes = Math.floor(this.timer / 60);
    var seconds = this.timer - minutes * 60; 

    return this.padStringLeft(minutes, "0", 2) + ":" + this.padStringLeft(seconds, "0", 2);
  }

  private padStringLeft(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }
}
