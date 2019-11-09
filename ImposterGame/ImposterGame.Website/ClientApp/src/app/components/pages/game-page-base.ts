import { Injectable, OnInit } from "@angular/core";
import { PageBase } from "./page-base";

@Injectable({
    providedIn: 'root'
})
export abstract class GamePageBase extends PageBase {
    constructor() {
        super();
     }

    async pageOnInit() {
        await this.gamePageOnInit();
    }

    abstract async gamePageOnInit();
}