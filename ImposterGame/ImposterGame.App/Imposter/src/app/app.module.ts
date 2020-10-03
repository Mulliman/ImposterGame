import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { HeaderComponent } from './components/header/header.component';
import { BASE_PATH, PlayerApiService, GameApiService } from 'src/server';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [HeaderComponent],
  imports: [BrowserModule,
     IonicModule.forRoot({
      mode: 'ios'
    }),
     AppRoutingModule,
     ComponentsModule,
     HttpClientModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: BASE_PATH, useValue: environment.apiBaseUrl },

    // APIs
    PlayerApiService,
    GameApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
