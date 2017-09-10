import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { LocalStorageService } from "./local-storage.service";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    
    currentUser: any = this.getCurrentUser();
    loggedInUserSubject = new BehaviorSubject<any>(this.currentUser);
    private apiUrl = environment.baseAPIUrl;


    constructor(private http: Http,
                private router: Router,
                private localStorage: LocalStorageService) {}

    syncUser(): Observable<any> {
        return this.loggedInUserSubject.asObservable()
    }

    login(credentials: any): Observable<any> {
        return this.http.post(this.apiUrl + "login", credentials)
            .map(res => {
                this.setCurrentUser(res.json());
                return this.currentUser;
            })
            .catch(error => {
                return Observable.throw(error.message || error)
            });
    }
    
    logout(clickEvent?): void {
        if (clickEvent) {
            event.preventDefault();
        }
        this.currentUser = '';
        this.localStorage.delAll();
       
        this.loggedInUserSubject.next('');
        this.localStorage.set('logout', true);
        this.router.navigate(['/login']);
        
    }
    
    justLoggedOut(): boolean {
        if (this.localStorage.get('logout')) {
            this.localStorage.del('logout');
            return true;
        } else {
            return false;
        }
    }
    static getUserKey(): string {
        return LocalStorageService.authUserKey;
    }

    getCurrentUser(): any {
        if (this.currentUser) {
            //in memory already
            return this.currentUser;
        }
        let storageKey = AuthService.getUserKey();
        let currentUser = this.localStorage.get(storageKey);
        return currentUser || '';
    }
    
    setCurrentUser(user: any) : void {
        this.currentUser = user;
        this.loggedInUserSubject.next(this.currentUser);
        let storageKey = AuthService.getUserKey();
        this.localStorage.set(storageKey, user);
    }

    getToken(): string {
        if (this.currentUser) {
            return this.currentUser.token;
        } else {
            return '';
        }
    }

    register(registrationData: any): Observable<any> {
        return this.http.post(this.apiUrl + "users", registrationData)
            .map(res => {
                this.setCurrentUser(res.json());
                return this.currentUser;
            })
            .catch(error => {
                return Observable.throw(error.message || error)
            });
    }
}
