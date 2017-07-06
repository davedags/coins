import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AuthService } from "../common/auth.service";
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Observable";
import { Coin } from '../model/coin';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PortfolioService {

    private apiUrl = environment.baseAPIUrl + "portfolio"

    constructor(private http:Http, private authService:AuthService) {
    }

    getList():Observable<any> {
       
        let idx = 0;
        let httpOptions = this.getAuthHTTPOptions();
        return this.http.get(this.apiUrl, httpOptions)
            .map(
                res => {
                    let jsonResults = res.json();
                    let collection = jsonResults.results.map(item => {
                        idx = idx + 1;
                        let rowCoin = new Coin();
                        rowCoin.position = idx;
                        rowCoin.name = item.long;
                        rowCoin.symbol = item.short;
                        rowCoin.price = item.price;
                        rowCoin.marketCap = item.mktcap;
                        rowCoin.percent24 = item.cap24hrChange;
                        if (item.image_url) {
                            rowCoin.image_url = item.image_url;
                        }
                        return rowCoin;
                    });
                    let marketCap = jsonResults.marketCap;
                    let returnVal = {
                        totalMarketCap: marketCap,
                        coins: collection
                    };
                    return returnVal;
                })
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }
    
    getAuthHTTPOptions(): RequestOptions {
        let userToken = this.authService.getToken();
        let headers = new Headers({'Authorization': 'Bearer ' + userToken});
        let options = new RequestOptions({headers: headers});
        return options;
    }
}
