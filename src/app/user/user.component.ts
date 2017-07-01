import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { AuthorizedUser } from "../login/login.component";

export class RegistrationData {
    username: string;
    password: string;
}


@Component({
      selector: 'app-user',
      providers: [
          UserService
      ],
      templateUrl: './user.component.html',
      styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

    credentials: RegistrationData;
    user: AuthorizedUser;
    error: boolean;

    constructor(private userService: UserService, private router: Router) {
        this.error = false;
    }

    ngOnInit() {
    }

    create(credentials: RegistrationData): void {
        this.userService.create(credentials)
            .subscribe(
                user => this.user = user,
                error => {
                    this.error = true
                    this.user = null;
                }
            );
    }


}
