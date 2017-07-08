/**
 * Created by daved_000 on 7/7/2017.
 */
import { Headers, RequestOptions } from "@angular/http";

export class AuthHelper {
    
    static getAuthorizationOptions(userToken: string): RequestOptions {
        let headers = new Headers({'Authorization': 'Bearer ' + userToken});
        let options = new RequestOptions({headers: headers});
        return options;
    }
}