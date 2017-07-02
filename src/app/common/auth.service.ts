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
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    private apiUrl = environment.baseAPIUrl;
    
    constructor(private http:Http, private router: Router, private localStorage: LocalStorageService) {
        this.currentUser = this.getCurrentUser();
        if (this.currentUser) {
            this.isLoggedInSubject.next(true);
        }
    }
    
    isLoggedIn(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable().share();
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
    
    logout(): void {
        this.currentUser = '';
        let storageKey = AuthService.getUserKey();
        this.localStorage.del(storageKey);
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/']);
    }
    
    static getUserKey(): string {
        return LocalStorageService.genKey(LocalStorageService.authUserKey);
    }
    
    getCurrentUser(): any {
        if (this.currentUser) {
            //in memory already
            return this.currentUser;
        }
        let storageKey = AuthService.getUserKey();
        this.currentUser = this.localStorage.get(storageKey);
    }
    
    setCurrentUser(user: any) : void {
        this.currentUser = user;
        this.isLoggedInSubject.next(true);
        let storageKey = AuthService.getUserKey();
        this.localStorage.set(storageKey, user);
    }

    register(registrationData: any): Observable<any> {
        return this.http.post(this.apiUrl + "register", registrationData)
            .map(res => {
                this.setCurrentUser(res.json());
                return this.currentUser;
            })
            .catch(error => {
                return Observable.throw(error.message || error)
            });
    }
}
