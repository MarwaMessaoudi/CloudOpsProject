import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ServerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  provider: string; // AWS, Azure, OVH...

  @Column()
  region: string;

  @Column({ type: 'int' })
  cpu: number; // vCPU

  @Column({ type: 'int' })
  ramGb: number;

  @Column({ type: 'int' })
  storageGb: number;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'enum', enum: ServerStatus, default: ServerStatus.ONLINE })
  status: ServerStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}