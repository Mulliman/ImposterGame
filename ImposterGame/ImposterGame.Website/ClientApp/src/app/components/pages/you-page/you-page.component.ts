import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageBase } from '../page-base';

@Component({
  selector: 'app-you-page',
  templateUrl: './you-page.component.html',
  styleUrls: ['./you-page.component.css']
})
export class YouPageComponent extends PageBase {

  form: FormGroup;

  constructor() {
    super();

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z0-9]*')])
      //name: new FormControl('')
    });
   }

  pageOnInit() {
    
  }

  get name() {
    return this.form.get('name');
  }

  submitForm(formValues){
    
  }
}