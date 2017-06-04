import { Injectable } from '@angular/core';
import { URLSearchParams, Http} from "@angular/http";
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

export class Coin {
    //constructor(public name: string, public symbol: string, public price: number) {}
    constructor(public position: number, public name: string, public symbol: string, public price: number, public marketcap: number, public percent_24: number) {}
}

@Injectable()
export class CoinsService {

    private apiUrl = environment.baseAPIUrl + 'coins';
    results: Coin[];
    constructor(private http: Http) {
        this.results = [];
    }

    getCoins(): Promise<any> {
        let idx = 0;
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(
                res => {
                    return res.json().results.map(item => {
                        idx = idx + 1;
                        return new Coin(
                            idx,
                            item.long,
                            item.short,
                            item.price,
                            item.mktcap,
                            item.cap24hrChange
                        );
                    });
                })
            .catch(
                error => {
                    return Promise.reject(error.message || error)
                });
    }


}
