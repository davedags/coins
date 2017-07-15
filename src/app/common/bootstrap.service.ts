import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth-helper';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { Coin } from '../model/coin';

@Injectable()
export class BootstrapService {

    private listUrl = environment.baseAPIUrl + 'coins';
    private portfolioUrl = environment.baseAPIUrl + "portfolio";
    private data: any = [];
    private dataSubject = new BehaviorSubject<any>(this.data);
    private loaded: boolean = false;
    private portfolioMap: any = [];

    constructor(private http: Http, private authService: AuthService) {
    }

    getCoins(): Observable<any> {
        return this.dataSubject.asObservable()
    }

    loadData(): void {
        let idx = 0;
        let apiUrl = this.listUrl;
        if (this.authService.getToken()) {
            apiUrl = apiUrl + '-auth';
        }
        let options = AuthHelper.getAuthorizationOptions(this.authService.getToken());
        this.http.get(apiUrl, options)
            .map(
                res => {
                    let jsonResults = res.json();
                    let collection = jsonResults.results.map(item => {
                        idx = idx + 1;
                        item.idx = idx;
                        let rowCoin = new Coin(item);
                        return rowCoin;
                        });
                    let marketCap = jsonResults.marketCap;
                    let returnVal = {
                        totalMarketCap: marketCap,
                        coins: collection
                    };
                    return returnVal;
                })
            .catch((err: Response, caught: Observable<any>) => {
                    return Observable.throw(caught);
                })
            .subscribe(
                coinData => {
                    this.dataSubject.next(coinData);
                }
            )
    }

    loadPortfolioMap(): void {
        this.http.get(this.portfolioUrl, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
            .map(
                res => {
                    let symbolMap = [];
                    for (let row of res.json().results) {
                        symbolMap[row.symbol] = true;
                    }
                    return symbolMap;
                })
            .catch((err:Response, caught:Observable<any>) => {
                return Observable.throw(caught);
            })
            .subscribe(
                symbolMap => {
                    this.portfolioMap = symbolMap;
                }
            )
    }

}
