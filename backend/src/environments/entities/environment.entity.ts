import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum EnvType {
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
}

@Entity('environments')
@Unique(['projectId', 'type'])
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EnvType })
  type: EnvType;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, (p) => p.environments, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}