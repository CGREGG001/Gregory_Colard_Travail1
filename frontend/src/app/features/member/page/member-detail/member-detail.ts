import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { User } from '@core/models/api.model';
import { MemberService } from '@features/member/service';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.scss'
})
export class MemberDetail implements OnInit {
  // L'id est injecté depuis l'URL (ex: /members/detail/123)
  @Input() id!: string;

  private memberService = inject(MemberService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // --- ÉTAT ---
  member = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // --- FORMULAIRE D'ADMINISTRATION ---
  adminForm = this.fb.group({
    role: this.fb.control<string>('', { 
      validators: [Validators.required], 
      nonNullable: true 
    })
  });

  ngOnInit(): void {
    if (this.id) {
      this.loadMember();
    }
  }

  /**
   * Loads the member details from the API.
   */
  loadMember(): void {
    this.isLoading.set(true);
    // On réutilise la route Get Member by ID du backend (que l'on doit ajouter au MemberService Front)
    this.memberService.getMemberById(this.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.member.set(data);
          this.adminForm.patchValue({ role: data.role }); // Pré-remplit le formulaire avec le rôle actuel
        },
        error: () => this.errorMessage.set('Membre introuvable.')
      });
  }

  /**
   * Updates the member's role.
   */
  onUpdateRole(): void {
    if (this.adminForm.invalid) return;

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload = this.adminForm.getRawValue();

    this.memberService.updateMember(this.id, payload)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (updatedUser) => {
          this.member.set(updatedUser);
          this.successMessage.set('Le rôle a été mis à jour avec succès.');
        },
        error: () => this.errorMessage.set('Erreur lors de la mise à jour.')
      });
  }

  /**
   * Soft-deletes the member and redirects back to the list.
   */
  onBan(): void {
    const confirmation = confirm('ATTENTION : Voulez-vous vraiment bannir définitivement ce membre ?');
    
    if (confirmation) {
      this.memberService.deleteMember(this.id).subscribe({
        next: () => {
          alert('Membre banni avec succès.');
          this.router.navigate(['/dashboard/members']);
        },
        error: () => alert('Une erreur est survenue lors de la suppression.')
      });
    }
  }
}