import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ChooseGridComponent } from './modals/choose-grid/choose-grid.component';
import { OptionGridComponent } from './option-grid/option-grid.component';
import { PlayerAnswerListComponent } from './player-answer-list/player-answer-list.component';
import { HelpModalComponent } from './modals/help-modal/help-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorMessageComponent,
    ChooseGridComponent,
    OptionGridComponent,
    PlayerAnswerListComponent,
    HelpModalComponent
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
      HelpModalComponent
    ],
    entryComponents: [HelpModalComponent]
})
export class ComponentsModule { }
