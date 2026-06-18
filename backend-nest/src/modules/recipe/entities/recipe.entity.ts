import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { BaseEntity } from '@core/model/base.entity';
import { Member } from '@member/entities/member.entity';

@Entity('recipe')
export class Recipe extends BaseEntity {
    @PrimaryColumn('varchar', { length: 26, primaryKeyConstraintName: 'pk_recipe' })
    id!: string;

    @BeforeInsert()
    setId() {
    if (!this.id) {
        this.id = ulid();
    }
    }

    @Column({ name: 'title', type: 'varchar', length: 150 })
    title!: string;

    @Column({ name: 'description', type: 'text' })
    description!: string;

    @Column({ name: 'ingredients', type: 'json' }) // Stockage JSON pour la flexibilité des ingrédients
    ingredients!: string[];

    @Column({ name: 'preparation_time', type: 'integer' }) // En minutes
    preparationTime!: number;

    /**
     * Relation to the recipe's author.
     * Each recipe is linked to a single member, forming a many‑to‑one relation.
     * Deleting a member cascades and removes all their recipes.
     */
    @ManyToOne(() => Member, (member) => member.recipes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id', foreignKeyConstraintName: 'fk_recipe_member' })
    author!: Member;
}
