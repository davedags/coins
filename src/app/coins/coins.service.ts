import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { Coin } from './coin';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CoinsService {

    private listUrl = environment.baseAPIUrl + 'coins';
    private cc_base_url = 'https://www.cryptocompare.com';
    results: Coin[];
    res: any;
    constructor(private http: Http) {
        this.results = [];
    }
    
    getCoins(): Observable<any> {
      
        let idx = 0;
        return this.http.get(this.listUrl)
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


}
