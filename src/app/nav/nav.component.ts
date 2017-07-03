import { Component, Input } from '@angular/core';
import { AuthService } from "../common/auth.service";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {

    loggedInUser: Observable<boolean>;
    
    @Input()
    public isCollapsed: boolean = true;
    
    constructor(private authService: AuthService) {
        this.loggedInUser = authService.syncUser();
    }
    
    checkToggleOnMenuClick(): void {
        if (this.isCollapsed == false) {
            this.isCollapsed = true;
        }
    }

}
