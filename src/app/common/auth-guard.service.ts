import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService: AuthService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url = state.url;
        let isLoggedIn = !!this.authService.getCurrentUser();
        if (isLoggedIn) {
            if (url == "/login") {
                //When logged in, login route should not be accessible
                this.router.navigate(['']);
                return false;
            }
            
            //all other routes are accessible logged in
            return true;
        } else if (url != "/login") {
            //logged out
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}
