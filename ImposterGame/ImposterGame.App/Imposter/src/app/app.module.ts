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
import { BASE_PATH, PlayerApiService, GameApiService, OptionGridsApiService, RoundApiService } from 'src/server';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Animation, NavOptions,IonicAnimation } from '@ionic/core';
import { createAnimation } from '@ionic/core';
import { TransitionOptions, getIonPageElement } from '@ionic/core/dist/collection/utils/transition';
import { ServiceWorkerModule } from '@angular/service-worker';

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
     ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: BASE_PATH, useValue: environment.apiBaseUrl },

    // APIs
    PlayerApiService,
    GameApiService,
    OptionGridsApiService,
    RoundApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

