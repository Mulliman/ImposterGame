import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppPagesService {

  public routes = {
    you: "you"
  }

  constructor(private router: Router) {
  }

  goToYouPage() {
    this.router.navigate([`/${this.routes.you}`]);
  }
}