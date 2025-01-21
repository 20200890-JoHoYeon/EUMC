import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_push', { database: 'eumc_relay' })
export class EumcPushEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ nullable: false, length: 50 })
  patno: string;

  @Column({ nullable: false, length: 300 })
  pushKey: string;

  @Column({ nullable: false, length: 300 })
  appKey: string;

  @Column({ nullable: false, length: 100 })
  osType: string;

  @Column({ nullable: true, default: () => 'now()'})
  regDate: Date;

  @Column({ nullable: true })
  modifyDate: Date;
}
