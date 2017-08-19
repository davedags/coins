import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CollapseModule } from 'ngx-bootstrap';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { ToastConfig } from './common/toast-config';
import { FocusModule } from './focus/focus.module';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';

import { AppComponent } from './app.component';
import { CoinsComponent } from './coins/coins.component';
import { ConvertorComponent } from './convertor/convertor.component';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';
import { UserComponent } from './user/user.component';
import { NavComponent } from './nav/nav.component';

import { AuthService } from "./common/auth.service";
import { BootstrapService } from './common/bootstrap.service';
import { LocalStorageService } from './common/local-storage.service';
import { AuthGuardService } from './common/auth-guard.service';
import { MessageService } from './common/message.service';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CheckboxColumnComponent } from './coins/checkbox-column.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
    { path: 'convertor', component: ConvertorComponent },
    { path: 'coins/:id', component: CoinDetailComponent },
    { path: 'login', component: UserComponent, canActivate: [ AuthGuardService ] },
    { path: 'portfolio', component: PortfolioComponent, canActivate: [ AuthGuardService ]},
    { path: 'about', component: AboutComponent },
    { path: '', component: CoinsComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        CoinsComponent,
        ConvertorComponent,
        CoinDetailComponent,
        UserComponent,
        NavComponent,
        PortfolioComponent,
        CheckboxColumnComponent,
        AboutComponent
    ],
    imports: [  
        BrowserModule,
        HttpModule,
        FormsModule,
        Ng2SmartTableModule,
        FocusModule,
        CollapseModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.rectangleBounce,
            backdropBorderRadius: '6px',
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            primaryColour: '#ffffff'
        }),

        ToastModule.forRoot(),
        Ng2DeviceDetectorModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        AuthService,
        BootstrapService,
        LocalStorageService, 
        AuthGuardService, 
        MessageService,
        { provide: ToastOptions, useClass: ToastConfig }
    ],
    entryComponents: [ CheckboxColumnComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
