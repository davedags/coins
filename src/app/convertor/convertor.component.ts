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
    fiatAmount: any = 'loading ...'
    loaded: boolean = false;

    constructor(private coinService: CoinDetailService) {}

    ngOnInit() {

        this.coinService.getPrice(this.coinSymbol)
        .subscribe(price => {
            this.coinBasePrice = price;
            this.fiatAmount = this.formatNumber(this.coinBasePrice);
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

    formatNumber(num) {
        return Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
}
