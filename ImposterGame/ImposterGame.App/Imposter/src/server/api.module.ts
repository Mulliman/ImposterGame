import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { GameApiService } from './api/gameApi.service';
import { OptionGridsApiService } from './api/optionGridsApi.service';
import { PlayerApiService } from './api/playerApi.service';
import { RoundApiService } from './api/roundApi.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    GameApiService,
    OptionGridsApiService,
    PlayerApiService,
    RoundApiService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
