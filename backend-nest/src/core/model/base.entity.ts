import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Abstract class containing technical columns shared across all database entities.
 */
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Exclude({ toPlainOnly: true }) // Cacher de l'API par défaut
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt!: Date;
}
