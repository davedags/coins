import { Component, ViewContainerRef, OnDestroy, Renderer } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MessageService } from './common/message.service';
import { Subscription } from 'rxjs/Subscription';
import { BootstrapService } from './common/bootstrap.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

    private subscription: Subscription;
    
    constructor(private messageService: MessageService, 
                private toastr: ToastsManager, 
                vcr: ViewContainerRef,
                private bootstrapService: BootstrapService,
                private renderer: Renderer) {

        this.toastr.setRootViewContainerRef(vcr);
        this.bootstrapService.loadData();
    }

    ngOnInit() {
        this.subscription = this.messageService.getMessage().subscribe(
            message => {
                this.toastr.custom(message.body, message.title);
            }
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onDeactivateRoute(): void {
        this.renderer.setElementProperty(document.body, "scrollTop", 0);
    }
}
