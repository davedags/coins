/**
 * Created by daved_000 on 7/2/2017.
 */

export class Coin {

    public position: number;
    public name: string;
    public symbol: string;
    public price: number;
    public marketCap: number;
    public percent24: number;
    public image_url?: string;
    public in_portfolio?: boolean;

    constructor(data?: any) {

        if (data) {
            this.position = data.idx;
            this.name = data.name;
            this.symbol = data.symbol;
            this.price = data.price_usd;
            this.marketCap = data.market_cap_usd;
            this.percent24 = data.percent_change_24h;
            if (data.image_url) {
                this.image_url = data.image_url;
            }
            if (data.in_portfolio) {
                this.in_portfolio = true;
            } else {
                this.in_portfolio = false;
            }
        }
    }

}