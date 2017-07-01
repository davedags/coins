import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

export class Coin {
    
    public position: number;
    public name: string;
    public symbol: string;
    public price: number;
    public marketCap: number;
    public percent24: number;
    public image_url?: string;

    constructor() {}

}

@Injectable()
export class CoinsService {

    private listUrl = environment.baseAPIUrl + 'coins';
    private cc_base_url = 'https://www.cryptocompare.com';
    results: Coin[];
    res: any;
    constructor(private http: Http) {
        this.results = [];
    }

    getCoins(): Promise<any> {
        let idx = 0;

        return this.http.get(this.listUrl)
            .toPromise()
            .then(
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
                    return Promise.reject(error.message || error)
                });
    }


}
