import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vsuggestion',
  imports: [HttpClientModule, CommonModule,FormsModule],
  templateUrl: './vsuggestion.component.html',
  styleUrls: ['./vsuggestion.component.css'],
})
export class VsuggestionComponent implements OnInit {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  apiUrl: string = 'https://localhost:7297/api/Suggestion/';
  suggestions: any[] = [];
  isEditing: boolean = false; // Toggles the edit form
  currentSuggestion: any = null; // Holds the suggestion being edited

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchSuggestions();
  }

  // Fetch suggestions for the logged-in user
  fetchSuggestions(): void {
    const userId = this.userService.getUser().cus_id;
    this.http.get<any>(`${this.apiUrl}getbyid/${userId}`).subscribe(
      (response) => {
        this.suggestions = response.suggestions || [];
        console.log('Suggestions fetched successfully:', this.suggestions);
      },
      (error) => {
        this.triggerPopup(false, 'failed fetch suggestions.Try Again');
        console.error('Error fetching suggestions:', error);
      }
    );
  }

  editSuggestion(suggestion: any): void {
    this.isEditing = true;
    this.currentSuggestion = { ...suggestion }; // Copy to avoid direct mutation
  }

  saveSuggestion(): void {
    if (this.currentSuggestion) {
      // PUT request to update the suggestion
      this.http.put(`${this.apiUrl}${this.currentSuggestion.suggestion_id}`, this.currentSuggestion).subscribe({
        next: (response) => {
          console.log('Suggestion updated successfully:', response);
           this.triggerPopup(true, 'Suggestion Updated Successfully!');
          this.isEditing = false;
          this.currentSuggestion = null;
          this.fetchSuggestions(); // Refresh the suggestions list
        },
        error: (error) => {
          this.triggerPopup(false, 'Failed to update the suggestion. Please try again.');
          console.error('Error updating suggestion:', error);
        },
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentSuggestion = null;
  }

  deleteSuggestion(suggestionId: number): void {
    if (confirm('Are you sure you want to delete this suggestion?')) {
      this.http.delete(`${this.apiUrl}${suggestionId}`).subscribe({
        next: (response) => {
          this.triggerPopup(true, 'Suggestion deleted successfully!');
          this.fetchSuggestions(); // Refresh the list after deletion
        },
        error: (error) => {
          this.triggerPopup(false, 'Failed to delete the suggestion. Please try again.');
          console.error('Error deleting suggestion:', error);
        },
      });
    }
  }
  triggerPopup(isSuccess: boolean, message: string): void {
    this.isSuccess = isSuccess;
    this.popupMessage = message;
    this.showPopup = true;
  
    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false; 
    }, 3000);
  }
}
