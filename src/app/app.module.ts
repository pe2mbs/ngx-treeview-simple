import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TreeModule } from 'library/treeview/treeview.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AngularFontAwesomeModule,
        TreeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
