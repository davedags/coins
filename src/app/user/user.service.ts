import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { RegistrationData } from './user.component';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    private apiUrl = environment.baseAPIUrl + "users";

    constructor(private http:Http) {
    }

    getById(id:number):Observable<any> {
        return this.http.get('/api/users/' + id, this.jwt()).map((response:Response) => response.json());
    }

    register(user: RegistrationData): Observable<any> {
        return this.http.post(this.apiUrl, user, this.jwt()).map((response:Response) => response.json());
    }
    create(user:any):Observable<any> {
        return this.http.post(this.apiUrl, user, this.jwt()).map((response:Response) => response.json());
    }

    update(user:any):Observable<any> {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response:Response) => response.json());
    }

    delete(id:number):Observable<any> {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response:Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }
}
