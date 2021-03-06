import { Injectable, OnInit } from "@angular/core";
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { AppPagesService } from '../services/app-pages.service';
import { BaseGamePage } from './baseGamePage';
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseGameFormPage extends BaseGamePage {

    form: FormGroup;

    get controls() { return this.form.controls; }

    constructor(playerService: PlayerService,
        gameService: GameService,
        appPages: AppPagesService,
        protected formBuilder: FormBuilder) {
        super(playerService, gameService, appPages);

        this.instantiateForm();
    }

    abstract setAllowedStates(): string[];

    abstract async gamePageOnInit();

    abstract instantiateForm();

    shouldErrorMessageShow(errorCode: string, path?: Array<string | number> | string) {

        var control = this.form.get(path);

        if(!control){
            return;
        }

        if(control.pristine){
            return;
        }

        return this.form.hasError('required', 'name');

    }
}