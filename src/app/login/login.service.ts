import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from '../../environments/environment';
import { Credentials } from './login.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

    private apiUrl = environment.baseAPIUrl + "login";

    constructor(private http:Http) {}

    login(credentials: Credentials): Observable<any> {
        return this.http.post(this.apiUrl, credentials)
            .map(res => {
                return res.json()
            })
            .catch(error => {
                return Observable.throw(error.message || error)
            });

    }

}
