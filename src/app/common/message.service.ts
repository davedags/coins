import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {

    private subject = new Subject<any>();
    
    constructor() { }

    sendMessage(message: string, subject?: string) {
        let msg = {
            title: subject,
            body: message
        }
        this.subject.next(msg);
    }
    
    clearMessage() {
        this.subject.next();
    }
    
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
