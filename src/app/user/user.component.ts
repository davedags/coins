import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../common/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

    username: string;
    password: string;
    login_error: boolean;
    registration_error: boolean;
    
    public focusTriggerEventEmitter = new EventEmitter<boolean>();
    
    constructor(private authService: AuthService, private router: Router) {
        this.username = '';
        this.password = '';
    }
    
    ngOnInit() {}
    
    ngAfterViewInit(): void {
        this.focusInput();
    }
    
    focusInput(): void {
        this.focusTriggerEventEmitter.emit(true);
    }

    login(): void {
        let credentials = {
            'username': this.username,
            'password': this.password
        };
        this.authService.login(credentials)
            .subscribe(
                data => {
                    this.router.navigate(['']);
                },
                error => {
                    this.login_error = true;
                    this.registration_error = false;
                }
            );
    }

    register(): void {
        let registrationData = {
            'username': this.username,
            'password': this.password
        };
        this.authService.register(registrationData)
            .subscribe(
                data => this.router.navigate(['']),
                error => {
                    this.registration_error = true;
                    this.login_error = false;
                }
            );

    }

   

}
