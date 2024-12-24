import { Component, inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminService } from '../admin.service';
import { RouterLink } from '@angular/router';
import { Chart,registerables } from 'chart.js'; // Import Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @Input() isSidebarActive: boolean = false;
  newtickets = 0;
  resolvedtickets = 0;
  ptickets = 0;
  rtickets = 0;
  adminid = 0;
  admin_type = ' ';
  apiURL: string = 'https://localhost:7297/api/Ticket/Login';
  tickets = 0;
  rticketsF: number = 0;
  pticketsF: number = 0;
  ticketsF: number = 0;
  formattedDates: string[] = [];
  ticket: any[] = [];

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit(): void {
    this.admin_type = this.adminService.getAdminType();
    this.getNewTickets();
    this.adminid = this.adminService.getAdminId();
    this.ProgressTickets();
    this.ResolvedTickets();

  }
  callMethod():void{
    this.createResolvedTicketsStatusChart();
  }

  ProgressTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/in-progress-tickets/${this.adminid}`).subscribe(
      (response) => {
        this.ptickets = response.length;
        this.pticketsF = 1; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching in-progress tickets:', error);
      }
    );
  }

  ResolvedTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/resolved/${this.adminid}`).subscribe(
      (response) => {
        this.rtickets = response.length; // Assign response data to tickets
        this.rticketsF = 1;
        this.checkAllDataFetched();
      },
      (error) => {
        console.error('Error fetching resolved tickets:', error);
      }
    );

  }

  getNewTickets(): void {
    this.http.get<any[]>(`${this.apiURL}/${this.admin_type}`).subscribe(
      (data) => {
        this.tickets = data.length; // Set the tickets data
        this.ticketsF = 1;
        this.ticket = data;

        // Process the data to find tickets raised per day
        const ticketsPerDay = this.getTicketsRaisedPerDay(data);
        const ticketsByPriority = this.getTicketsByPriority(data);
        console.log('Tickets Raised Per Day:', ticketsPerDay);

        // Example: Use this data for analytics chart
        const labels = Object.keys(ticketsPerDay); // Dates
        const counts = Object.values(ticketsPerDay); // Ticket counts
        
        this.createTicketsRaisedPerDayChart(labels, counts);
        this.createNewTicketsPriorityChart(Object.keys(ticketsByPriority), Object.values(ticketsByPriority));
      },
      (error) => {
        console.error('Error fetching new tickets', error);
      }
    );
  }

  getTicketsRaisedPerDay(data: any[]): { [key: string]: number } {
    const ticketsPerDay: { [key: string]: number } = {};

    data.forEach(item => {
        // Convert updated_at to yyyy-mm-dd format
        const updatedDate = new Date(item.updated_at).toISOString().split('T')[0];

        // Increment the count for the date
        if (ticketsPerDay[updatedDate]) {
            ticketsPerDay[updatedDate]++;
        } else {
            ticketsPerDay[updatedDate] = 1;
        }
    });

    return ticketsPerDay;
  }

  getTicketsByPriority(data: any[]): { [priority: string]: number } {
    const ticketsByPriority: { [priority: string]: number } = {};

    data.forEach(item => {
        const priority = item.priority || 'Unknown'; // Handle missing or undefined priority

        // Increment the count for the priority level
        if (ticketsByPriority[priority]) {
            ticketsByPriority[priority]++;
        } else {
            ticketsByPriority[priority] = 1;
        }
    });

    return ticketsByPriority;
}



  // Analytics 1: New Tickets Priority Chart
  createNewTicketsPriorityChart(label: string[], counts: number[]): void {
    new Chart('newTicketsPriorityChart', {
      type: 'doughnut', // Change this to 'pie' for a pie chart
      data: {
        labels: ['Critical','High', 'Medium','Low'], // Labels passed as argument
        datasets: [{
          label: 'Priority Distribution',
          data: counts, // Dynamic data passed as argument
          backgroundColor: ['#FF5733', '#FFBD33', '#33FF57', '#33FFBD'], // Colors for each priority
          hoverBackgroundColor: ['#FF5733', '#FFBD33', '#33FF57', '#33FFBD'] // Hover colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw + ' Tickets'; // Customizing tooltip text
              }
            }
          }
        }
      }
    });
  }
  

  // Analytics 2: Ticket Resolved Status Chart
  createResolvedTicketsStatusChart(): void {
    
    new Chart('resolvedTicketsStatusChart', {
      type: 'bar',
      data: {
        labels: ['New', 'In-Progress','Resolved'],
        datasets: [{
          label: 'Ticket Status',
          data: [this.tickets, this.ptickets ,this.rtickets],
          backgroundColor: ['#FF5733', '#FFBD33', '#33FF57'],
          hoverBackgroundColor: ['#FF5733', '#FFBD33', '#33FF57']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

  // Analytics 3: Tickets Raised Per Day Chart
  createTicketsRaisedPerDayChart(labels:string[],counts:number[]): void {
    new Chart('ticketsRaisedPerDayChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tickets Raised Per Day',
          data: counts, // Sample data, replace with real data
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  checkAllDataFetched(): void {
    if (this.ticketsF && this.pticketsF && this.rticketsF) {
      console.log(this.tickets,this.ptickets,this.rtickets)
      this.callMethod();
      
    }
    else{
      console.log(this.ticketsF,this.pticketsF,this.rticketsF)
      console.log('Data not fetched yet');
    }
  }

}
