import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService: AuthService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url = state.url;

        if (this.authService.getCurrentUser()) {
            if (url == "/login") {
                //When logged in, login route should not be accessible
                this.router.navigate(['']);
                return false;
            }
        }

        return true;
    }
}
