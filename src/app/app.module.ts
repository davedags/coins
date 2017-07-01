import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ModalModule } from 'ng2-bootstrap/modal';
import { FocusModule } from './focus/focus.module';
import { AppComponent } from './app.component';
import { CoinsComponent } from './coins/coins.component';
import { ConvertorComponent } from './convertor/convertor.component';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
    { path: 'convertor', component: ConvertorComponent },
    { path: 'coins/:id', component: CoinDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: UserComponent },
    { path: '', component: CoinsComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        CoinsComponent,
        ConvertorComponent,
        CoinDetailComponent,
        UserComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Ng2SmartTableModule,
        FocusModule,
        ModalModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
