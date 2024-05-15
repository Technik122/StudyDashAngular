import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReverseAuthGuard} from "./reserve-auth.guard";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
