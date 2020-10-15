import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ChooseGridComponent } from './modals/choose-grid/choose-grid.component';
import { OptionGridComponent } from './option-grid/option-grid.component';
import { PlayerAnswerListComponent, NotIncludingPlayerPipe } from './player-answer-list/player-answer-list.component';
import { HelpModalComponent } from './modals/help-modal/help-modal.component';
import { FormsModule } from '@angular/forms';
import { PlayerListComponent } from './player-list/player-list.component';
import { Subscription } from 'rxjs';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { IPlayer } from 'src/server';
import { GameContext } from '../services/gamecontext.service';
import { Game } from '../model/Game';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GameCodeComponent } from './game-code/game-code.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorMessageComponent,
    ChooseGridComponent,
    OptionGridComponent,
    NotIncludingPlayerPipe,
    PlayerAnswerListComponent,
    HelpModalComponent,
    PlayerListComponent,
    ScoreboardComponent,
    GameCodeComponent
  ],
  imports: [
    IonicModule.forRoot(), 
    CommonModule,
    FormsModule
  ],
    exports: [
      HeaderComponent,
      FooterComponent,
      ErrorMessageComponent,
      ChooseGridComponent,
      OptionGridComponent,
      PlayerAnswerListComponent,
      HelpModalComponent,
      PlayerListComponent,
      ScoreboardComponent,
      GameCodeComponent
    ],
    entryComponents: [HelpModalComponent]
})
export class ComponentsModule { }