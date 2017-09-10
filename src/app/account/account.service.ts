import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AuthService } from "../common/auth.service";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { AuthHelper } from '../common/auth-helper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class AccountService {

    private apiUrl = environment.baseAPIUrl + 'account/';
    
    constructor(private http: Http, private authService: AuthService) { }

    get(): Observable<any> {
        let currentUser = this.authService.getCurrentUser();
        return this.http.get(this.apiUrl + currentUser.user_id,  AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(
                res => res.json()
            )
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }

    save(data: any): Observable<any> {
        let currentUser = this.authService.getCurrentUser();
        return this.http.put(this.apiUrl + currentUser.user_id, data, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(
                res => res.json()
            )
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }

}
