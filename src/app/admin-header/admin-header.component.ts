import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent {
  
  navclose() {
    this.isSidebarActive = false;
  }
  isSidebarActive: boolean = false;
  adminService = inject(AdminService)
  router = inject(Router)
  toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
    this.togglestatus.emit(this.isSidebarActive);
  }
  @Output() togglestatus = new EventEmitter<boolean>();
  logout(): void {
    this.adminService.clearAdminData(); // Clear session storage
    this.router.navigate(['/']); // Redirect to the login page
  }
}
