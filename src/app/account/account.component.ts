import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { MessageService } from '../common/message.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    providers: [ AccountService ]
})
export class AccountComponent implements OnInit {
    
    accountData: any = {};

    constructor(private accountService: AccountService, private messageService: MessageService) { }

    ngOnInit() {
        this.accountService.get()
            .subscribe(
                data => {
                    this.accountData = data;
                },
                error => this.accountData = ''
            );
    }

    submitForm() {
        this.accountService.save(this.accountData)
            .subscribe(
                success => {
                    this.messageService.sendMessage('Your account has been updated', 'Account Updated');
                },
                error => {
                   
                }
            );
    }

}
