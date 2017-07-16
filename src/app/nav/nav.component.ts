import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from "../common/auth.service";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {

    loggedInUser: Observable<boolean>;

    public navExpanded: boolean = false;
    @Output()
    public navToggle = new EventEmitter();

    constructor(private authService: AuthService) {
        this.loggedInUser = authService.syncUser();
    }

    toggleNav() {
        console.log('i am here');
        this.navExpanded = !this.navExpanded;
        console.log('expanded = ' + this.navExpanded);
        this.navToggle.emit(this.navExpanded);
    }
}
