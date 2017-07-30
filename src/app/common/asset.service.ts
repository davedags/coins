import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Observable";
import { AuthService } from "../common/auth.service";
import { AuthHelper } from '../common/auth-helper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AssetService {

  private apiUrl = environment.baseAPIUrl + "asset";

  constructor(private http:Http, private authService: AuthService) {}

  get(id: string): Observable<number> {
    return this.http.get(this.apiUrl + "/" + id, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
        .map(res => res.json())
        .catch(
            error => {
              return Observable.throw(error.message || error)
            });
  }

  create(id: string, quantity: number): Observable<any> {
    let payload = {
      symbol: id,
      quantity: quantity
    }
    return this.http.post(this.apiUrl, payload, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
        .map(res => res.json())
        .catch(
            error => {
              return Observable.throw(error.message || error)
            });

  }

  update(id: string, quantity: number): Observable<any> {
    let payload = {
      quantity: quantity
    };
    return this.http.put(this.apiUrl + "/" + id, payload, AuthHelper.getAuthorizationOptions(this.authService.getToken()))
        .map(res => res.json())
        .catch(
            error => {
              return Observable.throw(error.message || error)
            });

  }

}
