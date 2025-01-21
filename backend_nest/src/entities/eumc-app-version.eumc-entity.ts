import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_app_version', { database: 'eumc_relay' })
export class EumcAppVersionEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ nullable: false, length: 11 })
  version: string;

  @Column({ nullable: false, length: 1 })
  forceUpdate: string;

  @Column({ nullable: false })
  memo: string;

  @Column({ nullable: false, length: 100 })
  osType: string;

  @Column({ nullable: true, default: () => 'now()'})
regDate: Date;
}
