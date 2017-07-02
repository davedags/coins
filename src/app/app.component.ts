import { Component, Input } from '@angular/core';
import { AuthService } from "./common/auth.service";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Crypto Bliss';
    isLoggedIn: Observable<boolean>;
    @Input()
    public isCollapsed: boolean = true;
    
    constructor(private authService: AuthService) {
        this.isLoggedIn = authService.isLoggedIn();
    }
}
