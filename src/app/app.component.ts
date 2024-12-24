import { Component, } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { filter } from 'rxjs';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { MyProfileComponent } from "./my-profile/my-profile.component";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, AdminHeaderComponent, MyProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CEC';

  public showAdminNavbar = false;
  public showCustomerNavbar = false;


  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.router.routerState.snapshot.root;
  
      // Traverse the route tree to find the active child route
      let activeRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
  
      // Retrieve navbar type from route data
      const navbarType = activeRoute.data['navbarType'];
      this.showAdminNavbar = navbarType === 'admin';
      this.showCustomerNavbar = navbarType === 'customer';
    });
  }
  
}
