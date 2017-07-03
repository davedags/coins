import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MessageService } from './common/message.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

    subscription: Subscription;

    constructor(private messageService: MessageService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.subscription = this.messageService.getMessage().subscribe(
            message => {
                this.toastr.success(message.body, message.title);
            }
        )
    }

    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
