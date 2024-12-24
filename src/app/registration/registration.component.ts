import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule, CommonModule,FontAwesomeModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  http = inject(HttpClient);
  router = inject(Router);

  showPassword: boolean = false;

  // Custom validator for password strength
  private strongPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password) ? null : {
      weakPassword: 'Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    };
  };

  // Custom validator for name (should not contain numbers)
  private noNumbersValidator: ValidatorFn = (control: AbstractControl) => {
    const name = control.value;
    const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces are allowed
    return nameRegex.test(name) ? null : {
      invalidName: 'Name should not contain numbers or special characters.'
    };
  };

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  // Initialize the form group for registration with the custom validators
  registrationForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(2), this.noNumbersValidator]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone_number: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  // Method to submit the registration data to the backend
  registerUser() {
    if (this.registrationForm.valid) {
    const emailControl = this.registrationForm.get('email');
    if (emailControl && emailControl.value) {
      emailControl.setValue(emailControl.value.toLowerCase());
    }
      this.http.post('https://localhost:7297/api/User', this.registrationForm.value)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
             this.triggerPopup(true, 'You have been registered successfully!');
            this.router.navigate(['login']);
            this.registrationForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            this.triggerPopup(false, `Error during registration: ${err.error}`);
          }
        });
    } else {
       this.triggerPopup(false, 'Please fill all fields correctly.');
    }
  }

  // Method to toggle the password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Navigate to the Sign-Up page
  navigateToSignIn() {
    this.router.navigate(['login']);
  }
  triggerPopup(isSuccess: boolean, message: string): void {
    this.isSuccess = isSuccess;
    this.popupMessage = message;
    this.showPopup = true;
  
    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false;
      
    }, 1000);
  }
}
