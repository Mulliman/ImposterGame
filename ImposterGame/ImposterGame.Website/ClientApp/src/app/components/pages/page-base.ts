import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class PageBase implements OnInit {

    isLoaded = false;

    constructor() { }

    async ngOnInit() {
        await this.pageOnInit();

        this.isLoaded = true;
    }

    abstract async pageOnInit();
}