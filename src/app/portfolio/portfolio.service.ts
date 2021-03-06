import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AuthService } from "../common/auth.service";
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Observable";
import { Asset } from '../model/asset';
import { AuthHelper } from '../common/auth-helper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class PortfolioService {

    private apiUrl = environment.baseAPIUrl + "portfolio";

    constructor(private http:Http, private authService:AuthService) {}

    getList(): Observable<any> {
        
        return this.http.get(this.apiUrl, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(
                res => {
                    let jsonResults = res.json();
                    let collection = jsonResults.results.map(item => {
                        let rowCoin = new Asset(item);
                        return rowCoin;
                    });
                    let totalValue = jsonResults.totalValue;
                    let returnVal = {
                        totalValue: totalValue,
                        coins: collection
                    };
                    return returnVal;
                })
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }

    get(id: string): Observable<boolean> {
        return this.http.get(this.apiUrl + "/" + id, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(res => res.json())
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }
    
    add(id: string): Observable<any> {
        let payload = {
            symbol: id
        };
        return this.http.post(this.apiUrl, payload, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(res => res.json())
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });

    }

    remove(id: string): Observable<any> {
        return this.http.delete(this.apiUrl + "/" + id, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(res => res.json())
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });

    }
}
