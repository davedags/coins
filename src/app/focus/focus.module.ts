import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusDirective } from './focus.directive';

@NgModule({
    declarations: [ FocusDirective ],
    imports: [ CommonModule ],
    exports: [ FocusDirective ]
})
export class FocusModule { }
