import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_w_meddept', { database: 'eumc_relay' })
export class EumcWaitingMeddeptEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ nullable: false, length: 2 })
  hsp_tp_cd: string;

  @Column({ nullable: false, length: 50 })
  pact_id: string;

  @Column({ nullable: false, length: 10 })
  patno: string;

  @Column({ nullable: true, default: () => 'now()'})
  regDate: Date;

  @Column({ nullable: true })
  callDate: Date;
}
