import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from './header/header.component';
import { AuthContentComponent } from './auth-content/auth-content.component';
import { AxiosService } from "./axios.service";
import { WelcomeContentComponent } from './welcome-content/welcome-content.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ContentComponent } from './content/content.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthContentComponent,
    WelcomeContentComponent,
    LoginFormComponent,
    ContentComponent,
    ButtonsComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatCheckbox,
    MatCardActions,
    MatCardHeader
  ],
  providers: [AxiosService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
