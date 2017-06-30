import { Component, OnInit } from '@angular/core';
import { CoinDetailService } from './coin-detail.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-coin-detail',
    providers: [
        CoinDetailService
    ],
    templateUrl: './coin-detail.component.html',
    styleUrls: ['./coin-detail.component.css']
})
export class CoinDetailComponent implements OnInit {

    symbol: string;
    detail: any;
    price: any;
    image_base_url: string = 'https://www.cryptocompare.com';
    
    constructor(private coinService: CoinDetailService, private route: ActivatedRoute) {
        
        this.detail = '';
        this.price = '';
        this.symbol = this.route.snapshot.params['id'];
    }

    ngOnInit() {
        this.loadDetail();
        this.loadPrice();
    }

    loadDetail(): void {
        this.coinService.getDetail(this.symbol)
            .then(res => {
                this.detail = res;
                console.log(this.detail);
            });
    }

    loadPrice(): void {
        this.coinService.getPrice(this.symbol)
            .then(res => {
                this.price = res;
                console.log(this.price);
            });
    }
}
