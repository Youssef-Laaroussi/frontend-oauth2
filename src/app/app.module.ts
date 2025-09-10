import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "@auth0/angular-jwt";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import {AuthModule} from "./auth/auth.module";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
         HttpClientModule,
          BrowserAnimationsModule,
          AuthModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
