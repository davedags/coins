import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { CollapseModule } from 'ngx-bootstrap';
import { FocusModule } from './focus/focus.module';

import { AppComponent } from './app.component';
import { CoinsComponent } from './coins/coins.component';
import { ConvertorComponent } from './convertor/convertor.component';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';
import { UserComponent } from './user/user.component';

import { AuthService } from "./common/auth.service";
import { LocalStorageService } from './common/local-storage.service';
import { AuthGuardService } from './common/auth-guard.service';

const appRoutes: Routes = [
    { path: 'convertor', component: ConvertorComponent },
    { path: 'coins/:id', component: CoinDetailComponent },
    { path: 'login', component: UserComponent, canActivate: [ AuthGuardService ] },
    { path: '', component: CoinsComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        CoinsComponent,
        ConvertorComponent,
        CoinDetailComponent,
        UserComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Ng2SmartTableModule,
        FocusModule,
        CollapseModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [ AuthService, LocalStorageService, AuthGuardService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
