import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    static readonly appKeyPrefix = 'coinpedia_';
    static readonly authUserKey = 'currentUser';
    cache: any = {};
    isSupported: boolean;
    
    constructor() {
        this.isSupported = this.checkSupport();
    }
    
    static genKey(key: string): string {
        return LocalStorageService.appKeyPrefix + key;
    }

    set(key, val): void {
        if (this.isSupported) {
            let storageKey = LocalStorageService.genKey(key);
            let storageVal = (typeof val === "string" ? val : JSON.stringify(val));
            localStorage.setItem(storageKey, storageVal);
        }
    }

    get(key): any {
        if (this.isSupported) {
            let storageKey = LocalStorageService.genKey(key);
            let storageVal = localStorage.getItem(storageKey);
            let returnVal = '';
            try {
                returnVal = JSON.parse(storageVal);
            } catch(e) {
                returnVal = storageVal;
            }
            return returnVal;
        }
    }

    del(key): void {
        if (this.isSupported) {
            let storageKey = LocalStorageService.genKey(key);
            localStorage.removeItem(storageKey);
        }
    }

    delAll(): void {
        if (this.isSupported) {
            localStorage.clear();
        }
    }
    

    checkSupport(): boolean {
        let test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e){
            return false;
        }
    }

}
