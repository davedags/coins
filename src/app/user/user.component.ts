import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../common/auth.service";
import { MessageService } from '../common/message.service';
import { BootstrapService } from '../common/bootstrap.service';

@Component({
    selector: 'app-login',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements  OnInit, AfterViewInit {

    username: string;
    password: string;
    login_error: boolean;
    logout: boolean = false;
    registration_error: boolean;
    
    public focusTriggerEventEmitter = new EventEmitter<boolean>();
    
    constructor(private authService: AuthService, private router: Router, private bootstrapService: BootstrapService) {
        this.username = '';
        this.password = '';
    }
    
    ngOnInit() {
        if (this.authService.justLoggedOut()) {
            this.bootstrapService.loadData();
            this.logout = true;
        } 
    }

    ngAfterViewInit(): void {
        //this.focusInput();
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
                success => {
                    this.bootstrapService.loadData();
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
                success => this.router.navigate(['']),
                error => {
                    this.registration_error = true;
                    this.login_error = false;
                }
            );

    }

    returnHome(): void {
        this.router.navigate(['']);
    }   

}
