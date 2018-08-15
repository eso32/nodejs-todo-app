import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'epersonalny';
  email: string;
  password: string;

  constructor(private authService: AuthService) { }

  register(email, password) {
    console.log('got data in component: ', email, password);
    this.authService.register(email, password).subscribe(resp => {
      console.log('success! ', resp);
    }, err => {
      console.log('Err ', err);
    });
  }

  login(email, password) {
    console.log('got data in component: ', email, password);
    this.authService.login(email, password).subscribe(resp => {
      console.log('success! ', resp);
    }, err => {
      console.log('Err ', err);
    });
  }


}
