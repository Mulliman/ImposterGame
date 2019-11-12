import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorMessageComponent
  ],
  imports: [
    IonicModule.forRoot(), 
    CommonModule
  ],
    exports: [
      HeaderComponent,
      FooterComponent,
      ErrorMessageComponent
    ]
})
export class ComponentsModule { }
