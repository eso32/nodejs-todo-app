import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Path } from '../models/path.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(email, password) {
    console.log('service invoked');
    return this.http.post(Path.REGISTER, { email, password });
  }

  login(email, password) {
    console.log('service invoked');
    return this.http.post(Path.LOGIN, { email, password });
  }

}
