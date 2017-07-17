import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from "../common/auth.service";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {

    loggedInUser: Observable<boolean>;
    @ViewChild('collapseButton') collapseButton: ElementRef;

    constructor(private authService: AuthService) {
        this.loggedInUser = authService.syncUser();
    }

    collapseNav() {
        let event = new MouseEvent('click', { bubbles: true});
        this.collapseButton.nativeElement.dispatchEvent(event);
    }
}
