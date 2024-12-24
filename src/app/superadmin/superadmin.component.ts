import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class superadminComponent {

  showNav: boolean = false;
  showAdminTable: boolean = false;
  showUserTable: boolean = false;
  showAdminAdd: boolean = false;
  showUserAdd: boolean = false;
  showQueryTable: boolean = false;
  showSuggestionTable: boolean = false;
  toggleNav() {
    this.showNav = !this.showNav;
  }
//Constructor
  constructor() {
    this.fetchAdminData();
    this.fetchUsersData();
    this.fetchTicketsData();
    this.fetchSuggestionData();
  }
  
  http = inject(HttpClient);
  admins: any[] = [];
  users: any[] = [];
  tickets : any[] = [];
  totalAdmins : number = 0;
  totalUsers : number = 0;
  totalQueries : number = 0;
  Suggestions: any[] = [];
  totalSuggestions: number = 0;

  private apiUrl = 'https://localhost:7297/api/Admin';
  private apiUrlU = 'https://localhost:7297/api/User'
  private apiUrlT = 'https://localhost:7297/api/Ticket/GetAlltickets'
  private apiUrlS = 'https://localhost:7297/api/Suggestion'
  // Fetch admin data from the API
  fetchAdminData(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {  
        this.admins = data; // Store the fetched data directly
        this.totalAdmins = data.length;
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
      },
    });
  }
  fetchUsersData(): void {
    this.http.get<any[]>(this.apiUrlU).subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = data.length;
      }
  });
  }
  fetchTicketsData(): void {
    this.http.get<any[]>(this.apiUrlT).subscribe({
      next: (data) => {
        this.tickets = data;
        this.totalQueries = data.length;
      }
  });
  }

  fetchSuggestionData(): void {
    this.http.get<any[]>(this.apiUrlS).subscribe({
      next: (data) => {
        this.Suggestions = data;
        this.totalSuggestions = data.length;
      }
  });
  }
  // Call fetchAdminData when the component is initialized

  deleteAdmin(adminid: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/${adminid}`).subscribe({
        next: () => {
          alert('Admin deleted successfully');
          this.fetchAdminData(); // Refresh data
        },
        error: (err) => {
          console.error('Error deleting Admin:', err);
          alert(err.error?.message || 'Error deleting Admin');
        },
      });
    }

  }

  toggleAdminTable(): void {;
    this.showAdminTable = true;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleSuggestionTable(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = true;
  }

  toggleUserTable(): void {
    this.showAdminTable = false;
    this.showUserTable = true;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleUserForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = true;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleAdminForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = true;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleTicketForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = true;
    this.showSuggestionTable = false;
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  adminForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    admin_type: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  addNewAdmin() {
    if (this.adminForm.valid) {
      this.http.post('https://localhost:7297/api/Admin', this.adminForm.value)
        .subscribe({
          next: (response) => {
            console.log('Admin created successfully:', response);
            alert('Admin has been created successfully!');
            this.fetchAdminData();
            this.adminForm.reset();
          },
          error: (err) => {
            console.error('Error during admin creation:', err);
            alert('There was an error while creating the admin. Please try again.');
          }
        });
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  userForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone_number: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  addNewUser() {
    if (this.userForm.valid) {
      this.http.post('https://localhost:7297/api/User', this.userForm.value)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            alert('You have been registered successfully!');
            this.fetchUsersData();
            this.userForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            console.error('Error during registration:', err);
            alert('There was an error during registration. Please try again.');
          }
        });
    } else {
      alert('Please fill all fields correctly.');
    }
  }



  //Edit Function

  editIndex: number | null = null;
  startEdit(index: number) {
    this.editIndex = index;
  }

  saveEdit(index: number) {
    const updatedUser = this.users[index];
    this.http.put(`${this.apiUrlU}/${updatedUser.user_id}`, updatedUser).subscribe({
      next: () => {
        alert('User updated successfully');
        this.editIndex = null; // Exit edit mode
        this.fetchUsersData(); // Refresh data
      },
      error: () => {
        alert('Error updating user');
      },
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.fetchUsersData(); // Revert changes by re-fetching data
  }

  //delete User
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrlU}/${userId}`).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.fetchUsersData(); // Refresh data
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert(err.error?.message || 'Error deleting user');
        },
      });
    }
  }

  //Edit on admin table
  editIndexU: number | null = null;

// Start editing a specific row
startEditU(index: number): void {
  this.editIndexU = index;
}

// Save edits for the specific row
saveEditU(index: number): void {
  const updatedAdmin = this.admins[index];
  this.http.put(`${this.apiUrl}/${updatedAdmin.admin_id}`, updatedAdmin).subscribe({
    next: () => {
      alert('Admin updated successfully');
      this.editIndexU = null; // Exit edit mode
      this.fetchAdminData(); // Refresh admin data
    },
    error: () => {
      alert('Error updating admin');
    },
  });
}

// Cancel editing (revert changes)
cancelEditU(): void {
  this.editIndexU = null;
  this.fetchAdminData(); // Re-fetch data to discard unsaved changes
}


}
