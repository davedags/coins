import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AuthService } from "../common/auth.service";
import { BootstrapService } from '../common/bootstrap.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-login',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements  OnInit, AfterViewInit, OnDestroy {

    username: string;
    password: string;
    login_error: boolean;
    logout: boolean = false;
    registration_error: boolean;
    subscription: Subscription;
    postLoginCoin: string = '';

    public focusTriggerEventEmitter = new EventEmitter<boolean>();
    
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private bootstrapService: BootstrapService,
                private location: Location) {
        this.username = '';
        this.password = '';
    }
    
    ngOnInit() {
        if (this.authService.justLoggedOut()) {
            this.bootstrapService.loadData();
            this.logout = true;
        } else {
            this.subscription = this.route
                .queryParams
                .subscribe(params => {
                    if (params['rtl']) {
                        this.postLoginCoin = params['rtl'];
                    }
                });
        }

    }

    ngAfterViewInit(): void {
        //this.focusInput();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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
                    if (this.postLoginCoin) {
                        let navExtras: NavigationExtras = {
                            queryParams: { 'portfolioAdd' : 1 }
                        }
                        this.router.navigate(["/coins", this.postLoginCoin], navExtras);
                    } else {
                        this.router.navigate(['']);
                    }
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
