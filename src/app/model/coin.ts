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

    constructor(data?: any) {

        if (data) {
            this.position = data.idx;
            this.name = data.long;
            this.symbol = data.short;
            this.price = data.price;
            this.marketCap = data.mktcap;
            this.percent24 = data.cap24hrChange;
            if (data.image_url) {
                this.image_url = data.image_url;
            }
        }
    }

}