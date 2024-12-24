import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-in-progress-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './in-progress-tickets.component.html',
  styleUrl: './in-progress-tickets.component.css'
})
export class InProgressTicketsComponent {
  rtickets: any[] = [];
  paginatedTickets: any[] = [];
  currentPage: number = 1;
  ticketsPerPage: number = 8;
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  ptickets: any[] =[];
  adminResponse = '';
  emailcontent = {to:'',subject:'Query Update Status',body:''};
  apiUrlE: string  = "https://localhost:7297/api/Email/send";
  apiUrlU: string  = "https://localhost:7297/api/User";
  // Selected ticket for editing
  selectedTicket: any = null;
  adminid = 0;
  http = inject(HttpClient);
  adminService = inject(AdminService);
  users: any[] =[];
  ngOnInit(): void {
    this.adminid = this.adminService.getAdminId();
    this.ProgressTickets();
    this.fetchUsersData();
  }

  fetchUsersData(): void {
    this.http.get<any[]>(this.apiUrlU).subscribe({
      next: (data) => {
        this.users = data;
      }
  });
  }
  // Fetch in-progress tickets from API
  ProgressTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/in-progress-tickets/${this.adminid}`).subscribe(
      (response) => {
        this.ptickets = response; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching in-progress tickets:', error);
      }
    );
  }
  
  
  updateTicket(ticket_id: number, status?: string, message?: string) {
    // API endpoint for updating the ticket
    const apiUrl = `https://localhost:7297/api/Ticket/update-ticket/${ticket_id}`;
  
    // Create the update payload, only including non-null values
    const updateRequest: any = {};
    if (status) { updateRequest.status = status; }
    if (message) { updateRequest.message = message; }
    const user = this.users.find(u => u.user_id === this.selectedTicket.customer_id);
    console.log(user.email);
    if (user) {
      this.emailcontent.to = user.email; // Set the email address dynamically
    } else {
      console.error('User not found for the ticket.');
      this.emailcontent.to = 'sivavicky223@gmail.com'; // Default email if user not found
    }
    this.emailcontent.body = `
      Dear Customer,

      Your query has been updated with the following

      Status: "${status}"
      Message from Admin: ${message}

      ---

      For further assistance, contact us at 
      CEC@Support.com or call +91 9234567890.
      © 2024 CEC. All rights reserved.
      `;
  
    // HTTP PUT request to update the ticket
    this.http.put(apiUrl, updateRequest, { responseType: 'text' }).subscribe(
      (response) => {
        this.popupMessage = 'Ticket Resolved successfully!';
        this.showPopup = true;
        this.isSuccess = true;  // Show the popup after successful update
        this.adminResponse = ''; // Clear the admin response field
        this.ProgressTickets();  // Refresh the tickets list
        this.sendEmail(this.emailcontent); // Send email notification
      },
      (error) => {
        console.error('Error updating ticket:', error);
        this.popupMessage = `Failed to resolve the ticket.`;
        this.showPopup = true;
        this.isSuccess = false;
      }
    );
  }

  // Open popup with selected ticket
  openPopup(ticket: any): void {
    this.selectedTicket = { ...ticket }; // Clone ticket to avoid reference issues
  }

  // Close popup without saving
  closePopup(): void {
    this.selectedTicket = null;
    this.showPopup = false;
  }

  // Handle Resolve button click
  resolveTicket(): void {
    if (this.selectedTicket) {
      this.updateTicket(this.selectedTicket.ticket_id, 'resolved', this.adminResponse);
    }
  }

  sendEmail(email: { to: string; subject: string; body: string }): void {
    this.http.post(this.apiUrlE, email).subscribe(
      (response) => {
        console.log('Email sent successfully:', response);
      },
      (error) => {
        console.error('Error sending email:', error);
      }
    );
  }

  updatePaginatedTickets(): void {
    const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
    const endIndex = startIndex + this.ticketsPerPage;
    this.paginatedTickets = this.rtickets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTickets();
  }

  get totalPages(): number {
    return Math.ceil(this.rtickets.length / this.ticketsPerPage);
  }
}
