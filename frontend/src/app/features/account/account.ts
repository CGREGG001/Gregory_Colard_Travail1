import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { AccountService } from '@core/account/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.scss'
})
export class AccountComponent implements OnInit {
  public authService = inject(AuthService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  profileForm = this.fb.group({
    nickname: this.fb.control<string>('', { 
      validators: [Validators.required, Validators.minLength(3)], 
      nonNullable: true
    }),
    email: this.fb.control<string>('', { 
      validators: [Validators.required, Validators.email], 
      nonNullable: true
    })
  });

  ngOnInit() {
    // On pré-remplit avec les infos déjà en mémoire dans AuthService
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        nickname: user.nickname,
        email: user.email
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    // getRawValue() renvoie exactement { nickname: string; email: string }
    const payload = this.profileForm.getRawValue();

    this.accountService.updateMe(payload).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (updatedUser) => {
        this.successMessage.set('Profil mis à jour avec succès.');
        this.authService.currentUser.set(updatedUser);
      },
      error: () => this.errorMessage.set('Erreur lors de la mise à jour.')
    });
  }
}