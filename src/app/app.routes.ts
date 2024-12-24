import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { superadminComponent } from './superadmin/superadmin.component';
import { CreateadminComponent } from './createadmin/createadmin.component';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { RaiseticketComponent } from './raiseticket/raiseticket.component';
import { ViewticketsComponent } from './viewtickets/viewtickets.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { NewTicketsComponent } from './new-tickets/new-tickets.component';
import { InProgressTicketsComponent } from './in-progress-tickets/in-progress-tickets.component';
import { ResolvedTicketsComponent } from './resolved-tickets/resolved-tickets.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { VsuggestionComponent } from './vsuggestion/vsuggestion.component';


export const routes: Routes = [

    {path:'',component:HomeComponent,data: { navbarType: 'none' }},
    {path:'alogin',component:AdminloginComponent,data: { navbarType: 'none' }},
    {path:'register',component:RegistrationComponent,data: { navbarType: 'none' }},
    {path:'login',component:LoginComponent,data: { navbarType: 'none' }},
    {path:'superadmin_',component:superadminComponent,data: { navbarType: 'none' }},
    {path:'addadmin',component:CreateadminComponent,data: { navbarType: 'none' }},
    {path:'suggestion',component:SuggestionComponent,data: { navbarType: 'customer' }},
    {path:'userhome',component:UserhomeComponent,data: { navbarType: 'customer' }},
    {path:'ticket',component:RaiseticketComponent,data: { navbarType: 'customer' }},
    {path:'mytickets',component:ViewticketsComponent,data: { navbarType: 'customer' }},
    {path:'newtickets',component:NewTicketsComponent,data: { navbarType: 'admin' }},
    {path:'inprogress',component:InProgressTicketsComponent,data: { navbarType: 'admin' }},
    {path:'resolvedtickets',component:ResolvedTicketsComponent,data: { navbarType: 'admin' }},
    {path:'adashboard',component:AdminDashboardComponent,data: { navbarType: 'admin' }},
    {path:'myprofile',component:MyProfileComponent,data: { navbarType: 'customer' }},
    {path:'viewsuggestion',component:VsuggestionComponent,data: { navbarType: 'customer' }},
    { path: '', redirectTo: '/home', pathMatch: 'full' }  
];
