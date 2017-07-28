import { Component, OnInit, Input } from '@angular/core';
import { CoinDetailService } from '../coin-detail/coin-detail.service';

@Component({
    selector: 'app-convertor',
    templateUrl: './convertor.component.html',
    styleUrls: ['./convertor.component.css'],
    providers: [
        CoinDetailService
    ]
})
export class ConvertorComponent implements OnInit {
    coinAmount: number = 1;
    coinSymbol: string = 'BTC';
    coinBasePrice: any = 'loading ...';
    fiatAmount: any = 'loading ...';
    loaded: boolean = false;
    popularCoins = [ 
            { name: 'BTC', class: 'primary'},
            { name: 'ETH', class: 'info'},
            { name: 'LTC', class: 'success'},
            { name: 'XMR', class: 'danger'},
            { name: 'XRP', class: 'warning'}
        ];
    
    constructor(private coinService: CoinDetailService) {}

    ngOnInit() {
        this.getCoinPrice();

    }

    getCoinPrice() {
        this.fiatAmount = 'loading ...';
        this.coinService.getPrice(this.coinSymbol)
            .subscribe(price => {
                this.coinBasePrice = price;
                let amount = this.coinAmount * this.coinBasePrice;
                this.fiatAmount = this.formatNumber(amount);
            });
    }

    updateFiatPrice() {
        if (this.coinBasePrice) {
            if (this.coinAmount <= 0) {
                this.fiatAmount = 0;
            } else if (this.coinAmount > 0) {
                let amount = this.coinAmount * this.coinBasePrice;
                this.fiatAmount = this.formatNumber(amount);
            }
        }
    }

    updateCoinAmount() {
        if (this.coinBasePrice) {
            if (this.fiatAmount <= 0) {
                this.coinAmount = 0;
            } else {
                let amount = parseFloat(this.fiatAmount.replace(/,/g, '')) / this.coinBasePrice;
                this.coinAmount = Number(amount.toLocaleString('en-US', { maximumFractionDigits: 5 }));
            }
        }
    }

    formatNumber(num) {
        return Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }


    changeCoin(symbol) {
        this.coinSymbol = symbol;
        this.getCoinPrice();
    }
}
