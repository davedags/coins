import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CoinDetailService {
    private detailApiUrl = environment.baseAPIUrl + 'coins/';
    private priceApiUrl = environment.baseAPIUrl + 'price/';
    detail: any;
    price: any;
    constructor(private http: Http) {
        this.detail = {};
        this.price = {};
    }

    getDetail(id: string): Promise<any> {
        return this.http.get(this.detailApiUrl + id)
            .toPromise()
            .then(
                res => {
                return res.json()
                })
            .catch(
                error => {
                return Promise.reject(error.message || error)
            });
    }
    
    getPrice(id: string): Promise<any> {
        return this.http.get(this.priceApiUrl + id)
            .toPromise()
            .then(
                res => {
                    return res.json()
                })
            .catch(
                error => {
                    return Promise.reject(error.message || error)
                });
    }

}
