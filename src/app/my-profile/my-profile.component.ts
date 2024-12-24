import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, CommonModule], // Add FormsModule here
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent {
  user: any = {}; // Holds user details
  apiUrl: string = 'https://localhost:7297/api/User/';
  userService = inject(UserService);
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  editProfile: boolean = false;
  editPassword: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = this.userService.getUser().cus_id; // Retrieve user_id from localStorage
    if (userId) {
      this.fetchUserDetails(userId);
    } else {
      this.triggerPopup(false, 'User Not Logged In');
    }
  }

  fetchUserDetails(userId: number): void {
    console.log('Fetching user details for ID:', userId);
    this.http.get<any>(`${this.apiUrl}${userId}`).subscribe(
      (response) => {
        this.user = response;
        console.log('User details fetched successfully:', this.user);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  updateProfile(userId: number): void {

    if (!this.validatePhoneNumber(this.user.phone_number)) {
      this.triggerPopup(false, 'Invalid phone number format.');
      return;
    }

    const updatedUser = {
      user_id: userId,
      name: this.user.name,
      email: this.user.email,
      phone_number: this.user.phone_number,
    };
    console.log(updatedUser.name);
    this.http.put(`${this.apiUrl}${userId}`, updatedUser).subscribe({
      next: () => {
        this.triggerPopup(true, 'User Updated Successfully!');
        this.fetchUserDetails(userId); // Refresh user data after update
      },
      error: (error) => {
        this.triggerPopup(false, 'Error updating user');
      },
    });
  }

  changePassword(user_id: number): void {
    // Validate password length and strength
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (!this.validateStrongPassword(this.newPassword)) {
      this.errorMessage =
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
      return;
    }

    // Validate new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New Password and Confirm Password do not match.';
      return;
    }

    // Clear error message
    this.errorMessage = '';

    // Prepare request payload
    const requestBody = {
      userId: user_id,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    // Send HTTP request to change password
    this.http.put('https://localhost:7297/api/User/ChangePassword', requestBody).subscribe({
      next: () => {
        this.triggerPopup(true, 'Password Changed Successfully!');
        this.resetForm();
      },
      error: () => {
        this.triggerPopup(false, 'Error changing password.');
      },
    });
  }

  resetForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  triggerPopup(isSuccess: boolean, message: string): void {
    this.isSuccess = isSuccess;
    this.popupMessage = message;
    this.showPopup = true;

    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false;
    }, 2000);
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[0-9]{10}$/; 
    return phoneRegex.test(phoneNumber);
  }

  validateStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
