import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ChooseGridComponent } from './modals/choose-grid/choose-grid.component';
import { OptionGridComponent } from './option-grid/option-grid.component';
import { PlayerAnswerListComponent } from './player-answer-list/player-answer-list.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorMessageComponent,
    ChooseGridComponent,
    OptionGridComponent,
    PlayerAnswerListComponent
  ],
  imports: [
    IonicModule.forRoot(), 
    CommonModule
  ],
    exports: [
      HeaderComponent,
      FooterComponent,
      ErrorMessageComponent,
      ChooseGridComponent,
      OptionGridComponent,
      PlayerAnswerListComponent
    ]
})
export class ComponentsModule { }
