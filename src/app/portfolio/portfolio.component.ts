import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service';

@Component({
    selector: 'app-portfolio',
    providers: [
        PortfolioService
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    listData: any;

    constructor(private portfolioService: PortfolioService) { }

    ngOnInit() {
        this.initList();
    }

    initList(): void {
        this.portfolioService.getList()
            .subscribe(
                list => {
                    this.listData = list;
                }
            );
    }

}
