import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

import { AppComponent } from './app.component';
//import { CollapseDirective } from 'ng2-bootstrap';
import { CoinsComponent } from './coins/coins.component';
import { ConvertorComponent } from './convertor/convertor.component';

const appRoutes: Routes = [
    { path: 'convertor', component: ConvertorComponent},
    { path: '', component: CoinsComponent }
];

@NgModule({
    declarations: [
        //CollapseDirective,
        AppComponent,
        CoinsComponent,
        ConvertorComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Ng2SmartTableModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
