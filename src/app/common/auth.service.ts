import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from '../../environments/environment';
import { LocalStorageService } from "./local-storage.service";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    
    currentUser: any;
    isLoggedInSubject = new BehaviorSubject<boolean>(this.hasCurrentUser());
    loggedInUsernameSubject = new BehaviorSubject<string>(this.getCurrentUsername());
    private apiUrl = environment.baseAPIUrl;
    
    constructor(private http:Http, private router: Router, private localStorage: LocalStorageService) {
        this.currentUser = this.getCurrentUser();
    }
    
    syncLoginStatus(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable();
    }

    syncUsername(): Observable<string> {
        return this.loggedInUsernameSubject.asObservable();
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
        let storageKey = AuthService.getUserKey();
        this.localStorage.del(storageKey);
        this.isLoggedInSubject.next(false);
        this.loggedInUsernameSubject.next('');
        let currentUrl = this.router.routerState.snapshot.url;
        if (currentUrl != '/') {
            this.router.navigate(['']);
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
        this.currentUser = currentUser;
        return currentUser;
    }
    
    setCurrentUser(user: any) : void {
        this.currentUser = user;
        this.isLoggedInSubject.next(true);
        this.loggedInUsernameSubject.next(this.currentUser.username);
        let storageKey = AuthService.getUserKey();
        this.localStorage.set(storageKey, user);
    }

    hasCurrentUser(): boolean {
        let auth = !!this.getCurrentUser();
        return auth;
    }
    
    getCurrentUsername(): string {
        let username = '';
        if (this.currentUser) {
            username = this.currentUser.username;
        }
        return username;
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
