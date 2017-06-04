import { Component, OnInit} from '@angular/core';
import { Coin, CoinsService } from './coins.service';

@Component({
    selector: 'app-coins',
    providers: [
        CoinsService
    ],
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {
    
    public coins: Coin[] = [];
    public settings: Object = {
        columns: {
            'position': {
                title: '#',
                width: '10px'
            },
            'name': {
                title: 'Name',
                width: '20px'
            },
            'symbol': {
                title: 'Symbol',
                width: '10px'
            },

            'price': {
                title: 'Price',
                width: '35px'
            },
            'marketcap': {
                title: 'Market Cap',
                width: '40px'
            },
            'percent_24': {
                title: '%24Hr',
                width: '15px'
            }
        },
        hideSubHeader: true,

        actions: {
            add: false,
            edit: false,
            delete: false
        },
        pager: {
            display: false
        },
        attr: {
            class: 'table table-bordered table-striped table-hover table-rankings'
        },
        noDataMessage: "Loading ..."

    };
    
    constructor(private coinService: CoinsService) {}
    
    
    ngOnInit() {
        this.initList();
    }

    initList(): void {
        this.coinService.getCoins()
            .then(coins => {
                this.coins = coins;
            });
    }


    
    
}
