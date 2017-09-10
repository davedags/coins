/**
 * Created by daved_000 on 7/30/2017.
 */
export class Asset {
    
    public name: string;
    public symbol: string;
    public price: number;
    public value: number;
    public quantity: number;
    public image_url?: string;
    public in_portfolio: boolean = true;

    constructor(data?: any) {
        if (data) {
            this.name = data.name;
            this.symbol = data.symbol;
            this.price = data.price_usd;
            this.value = data.value;
            this.quantity = data.quantity;
            if (data.image_url) {
                this.image_url = data.image_url;
            }
        }
    }

}