import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewRoundPage } from './new-round.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChooseGridComponent } from 'src/app/components/modals/choose-grid/choose-grid.component';

const routes: Routes = [
  {
    path: '',
    component: NewRoundPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewRoundPage],
  entryComponents: [ChooseGridComponent]
})
export class NewRoundPageModule {}
