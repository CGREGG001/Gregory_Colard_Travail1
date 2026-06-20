import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from '@core/models/api.model';
import { MemberService } from '@features/member/service/member.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-list.html',
  styleUrl: './member-list.scss'
})
export class MemberList implements OnInit {
  private memberService = inject(MemberService);

  // Le signal pour stocker les membres
  members = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.isLoading.set(true);
    this.memberService.getAllMembers().subscribe({
      next: (data) => {
        this.members.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger la liste des membres.');
        this.isLoading.set(false);
      }
    });
  }

  changeRole(id: string, newRole: string) {
    // Appel à l'API pour changer le rôle
    this.memberService.updateMember(id, { role: newRole }).subscribe({
      next: (updatedUser) => {
        // Mise à jour réactive du signal local (sans recharger toute la liste API)
        this.members.update(list => list.map(m => m.id === id ? updatedUser : m));
      },
      error: () => alert('Erreur lors du changement de rôle.')
    });
  }

  deleteMember(id: string) {
    if (confirm('Voulez-vous vraiment bannir ce membre ?')) {
      this.memberService.deleteMember(id).subscribe({
        next: () => {
          // Retire l'utilisateur de la liste visuellement
          this.members.update(list => list.filter(m => m.id !== id));
        },
        error: () => alert('Erreur lors de la suppression du membre.')
      });
    }
  }
}
