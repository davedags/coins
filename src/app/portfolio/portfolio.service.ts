import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AuthService } from "../common/auth.service";
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Observable";

@Injectable()
export class PortfolioService {

    private apiUrl = environment.baseAPIUrl + "portfolio"

    constructor(private http:Http, private authService:AuthService) {}

    getList():Observable<any> {
        let userToken = this.authService.getToken();
        let headers = new Headers({ 'Authorization': 'Bearer ' + userToken});
        let options = new RequestOptions( { headers: headers });

        return this.http.get(this.apiUrl, options)
            .map(
                res => {
                  return res.json();
                }
            )
            .catch(
                error => {
                  return Observable.throw(error.message || error);
                });
    }
}
