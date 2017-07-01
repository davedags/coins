import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from "./login.service";

export class Credentials {
    public username: string;
    public password?: string;

    constructor() {
        this.username = '';
        this.password = '';
    }
}

export class AuthorizedUser {
    username: string;
    token: string;

    constructor() {
        this.username = '';
        this.token = '';
    }
}

@Component({
    selector: 'app-login',
    providers: [
        LoginService  
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    credentials: Credentials;
    authorizedUser: AuthorizedUser;
    token: string;
    authenticated: boolean;

    public focusTriggerEventEmitter = new EventEmitter<boolean>();
    
    constructor(private loginService: LoginService, private router: Router) {
        this.token = '';
        this.authorizedUser = new AuthorizedUser();
        this.credentials = new Credentials();
    }
    
    ngOnInit() {}
    
    ngAfterViewInit(): void {
        this.focusInput();
    }
    
    focusInput(): void {
        this.focusTriggerEventEmitter.emit(true);
    }
    
    login() {

        this.loginService.login(this.credentials)
            .subscribe(
                data => {
                    this.authorizedUser.username = data.username;
                    this.authorizedUser.token = data.token;
                },
                error => {
                    this.authorizedUser = new AuthorizedUser();
                }
            );


    }

}
