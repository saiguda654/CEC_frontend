import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion',
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css'],
})
export class SuggestionComponent implements OnInit {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  cus_id: number = 0;
  http = inject(HttpClient);
  userService = inject(UserService)
  router = inject(Router);
  private apiUrl = 'https://localhost:7297/api/Suggestion'; // API URL directly in the component
  suggestionForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    // Assuming cus_id is fetched dynamically or set statically
    const user = this.userService.getUser();
    this.cus_id = user.cus_id;// Replace with actual logic if needed  
  }

  submitSuggestion(): void {
    if (this.suggestionForm.invalid) {
      this.triggerPopup(false, 'Please fill in all required fields.');
      return;
    }

    // Append customer ID dynamically to the form group values
    const payload = {
      ...this.suggestionForm.value,
      user_id: this.cus_id,
    };

    // Send data to the backend API
    this.http.post(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('Suggestion submitted successfully:', response);
        this.triggerPopup(true, 'Suggestion submitted successfully');
        console.log(payload);
        this.suggestionForm.reset();
       // End loading
      },
      error: (error) => {
        console.error('Error submitting suggestion:', error);
         this.triggerPopup(false, 'An error occurred while submitting your suggestion.');
       // End loading
      },
    });
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
}