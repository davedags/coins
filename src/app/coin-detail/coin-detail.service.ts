import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {BootstrapService} from '../common/bootstrap.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class CoinDetailService {

    private detailApiUrl = environment.baseAPIUrl + 'coins/';
    private priceApiUrl = environment.baseAPIUrl + 'price/';

    constructor(private http:Http, private bootstrapService: BootstrapService) { }

    getData(id:string):Observable<any> {
        return Observable.forkJoin(
            this.getDetail(id),
            this.getPrice(id),
            this.getPercentChange(id)
        );
    }

    getDetail(id:string):Observable<any> {
        return this.http.get(this.detailApiUrl + id)
            .map(
                res => {
                    let response = res.json();
                    return {
                        title: response.Name + " (" + response.Symbol + ")",
                        symbol: response.Symbol,
                        name: response.Name,
                        desc: response.Description,
                        features: response.Features,
                        tech: response.Technology,
                        image_url: response.image_url,
                        total_supply: response.TotalCoinSupply || 0,
                        algorithm: response.Algorithm,
                        proof: response.ProofType,
                        start_date: response.StartDate
                    }
                })
            .catch(
                error => {
                    return Observable.throw(error.message || error)
                });
    }

    getPrice(id:string):Observable<any> {
        let price = this.bootstrapService.getPriceBySymbol(id);
        if (price) {
            return Observable.of(price).map(res => res);
        } else {
            return this.http.get(this.priceApiUrl + id)
                .map(
                    res => {
                        return res.json()
                    })
                .catch(
                    error => {
                        return Observable.throw(error.message || error)
                    });
        }
    }

    getPercentChange(id:string):Observable<any> {
        let data = this.bootstrapService.getDataBySymbol(id);
        let percentChange = '';
        if (data) {
            if (data['percent24']) {
                percentChange = data['percent24'];
            }
        }
     
        return Observable.of(percentChange).map(res => res);
    }


}
