import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@core/auth';
import { ErrorHandlerService } from '@core/errors/error-handler.service';
import { RegisterPayload } from '@core/models/api.model';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  // --- UI STATE SIGNALS ---
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // --- FORM DEFINITION ---
  registerForm: FormGroup = this.fb.group({
    nickname: ['', [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(20)
    ]],
    email: ['', [
      Validators.required, 
      Validators.email
    ]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8) // Security : min char 8.
    ]]
  });

  /**
   * Handles the registration form submission.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Extraction typée des données du formulaire
    const payload: RegisterPayload = this.registerForm.getRawValue();

    this.authService.register(payload)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response.result === true) {
            this.router.navigate(['/login'], { 
              queryParams: { registered: 'true', email: payload.email } 
            });
          } else {
            // L'ApiService a intercepté une erreur (result: false)
            // On délègue le formatage au ErrorHandlerService !
            const msg = this.errorHandler.extractMessage(response);            
            this.errorMessage.set(msg); 
          }
        },
        error: (err) => {
          const msg = this.errorHandler.extractMessage(err);
          this.errorMessage.set(msg);
        }
      });
  }

  /**
   * Recursively marks all controls in a form group as touched to trigger validation messages.
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
